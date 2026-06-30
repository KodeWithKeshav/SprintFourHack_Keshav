require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mockData = require('./mockData.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

/* -------------------------------------------------------
   Gemini setup
   ------------------------------------------------------- */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let genAI = null;
let model = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  console.log('Gemini 2.5 Flash configured.');
} else {
  console.warn('GEMINI_API_KEY not set — POST /api/verify will be unavailable.');
}

/* -------------------------------------------------------
   Prompt builder
   ------------------------------------------------------- */
function buildVerifyPrompt(documentText, annotations) {
  const annotationsStr = annotations.length > 0
    ? JSON.stringify(annotations, null, 2)
    : '(none — scan the entire document for PII)';

  return `You are reviewing a document for personally identifying or sensitive information (PII). The document may be medical, financial, legal, or general business in nature — adapt your judgment to the domain.

You are given:
1. The full document text.
2. A list of existing suggested redaction annotations.

Do two things:
A. For each existing annotation, judge whether it is correctly identified as sensitive (CORRECT) or is actually harmless (FALSE_POSITIVE). Briefly state the reason.
B. Independently scan the entire document for any sensitive information NOT covered by an existing annotation (e.g. names, phone numbers, emails, addresses, SSNs/IDs, account or policy numbers, medical record numbers, diagnoses, dates of birth, financial figures tied to an identifiable person). List these as MISSED.

Sensitive categories include but are not limited to: person names, phone numbers, emails, physical addresses, government IDs, financial account numbers, medical record numbers, diagnoses/conditions, dates of birth.

Return ONLY valid JSON, no markdown, no commentary, in this exact shape:
{
  "verified": [
    { "text": "...", "type": "...", "originalStatus": "CORRECT" | "FALSE_POSITIVE", "confidence": 0.0-1.0, "reason": "..." }
  ],
  "missed": [
    { "text": "...", "type": "...", "confidence": 0.0-1.0, "reason": "..." }
  ]
}

Document:
"""
${documentText}
"""

Existing annotations:
${annotationsStr}`;
}

/* -------------------------------------------------------
   Parse and clean LLM response
   ------------------------------------------------------- */
function parseLLMResponse(rawText) {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.verified || !parsed.missed) {
    throw new Error('Response missing "verified" or "missed" arrays');
  }

  return parsed;
}

/* -------------------------------------------------------
   Find text offsets in the document body
   ------------------------------------------------------- */
function findTextOffset(documentText, searchText, usedRanges) {
  let searchFrom = 0;

  while (searchFrom < documentText.length) {
    const idx = documentText.indexOf(searchText, searchFrom);
    if (idx === -1) break;

    const end = idx + searchText.length;
    const overlaps = usedRanges.some(
      (r) => idx < r.end && end > r.start
    );

    if (!overlaps) {
      return { start: idx, end };
    }

    searchFrom = idx + 1;
  }

  return null;
}

/* -------------------------------------------------------
   Normalize LLM output into existing span format
   ------------------------------------------------------- */
function normalizeSpans(llmResult, documentText, originalAnnotations) {
  const spans = [];
  const usedRanges = [];
  let idCounter = 1;

  // Process verified annotations
  for (const item of llmResult.verified) {
    const groundTruth = item.originalStatus === 'FALSE_POSITIVE' ? 'falsePositive' : 'correct';

    // Try to find offsets from original annotations first
    const original = originalAnnotations.find(
      (a) => a.text === item.text || (a.text && a.text.toLowerCase() === item.text.toLowerCase())
    );

    let start, end;
    if (original && typeof original.start === 'number' && typeof original.end === 'number') {
      start = original.start;
      end = original.end;
    } else {
      const offset = findTextOffset(documentText, item.text, usedRanges);
      if (!offset) continue; // Skip if text not found in document
      start = offset.start;
      end = offset.end;
    }

    usedRanges.push({ start, end });

    spans.push({
      id: `r${idCounter++}`,
      start,
      end,
      text: item.text,
      type: (item.type || 'unknown').toLowerCase().replace(/\s+/g, '_'),
      confidence: item.confidence ?? (groundTruth === 'correct' ? 0.9 : 0.5),
      groundTruth,
      source: 'verified',
      reason: item.reason || '',
    });
  }

  // Process missed PII
  for (const item of llmResult.missed) {
    const offset = findTextOffset(documentText, item.text, usedRanges);
    if (!offset) continue; // Skip if text not found in document

    usedRanges.push({ start: offset.start, end: offset.end });

    spans.push({
      id: `r${idCounter++}`,
      start: offset.start,
      end: offset.end,
      text: item.text,
      type: (item.type || 'unknown').toLowerCase().replace(/\s+/g, '_'),
      confidence: item.confidence ?? 0.35,
      groundTruth: 'missed',
      source: 'missed',
      reason: item.reason || '',
    });
  }

  // Sort by position in document
  spans.sort((a, b) => a.start - b.start);

  return spans;
}

/* -------------------------------------------------------
   Routes
   ------------------------------------------------------- */

// Existing demo endpoint
app.get('/api/document', (_req, res) => {
  try {
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load document data' });
  }
});

// LLM-powered verification endpoint
app.post('/api/verify', async (req, res) => {
  if (!model) {
    return res.status(503).json({
      error: 'Gemini API key not configured. Set GEMINI_API_KEY environment variable and restart the server.',
    });
  }

  const { documentText, annotations = [] } = req.body;

  if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
    return res.status(400).json({ error: 'documentText is required and must be a non-empty string.' });
  }

  try {
    const prompt = buildVerifyPrompt(documentText, annotations);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    const llmResult = parseLLMResponse(rawText);
    const redactions = normalizeSpans(llmResult, documentText, annotations);

    res.json({
      document: {
        id: `doc-${Date.now()}`,
        title: 'Uploaded Document',
        body: documentText,
      },
      redactions,
    });
  } catch (error) {
    console.error('LLM verification failed:', error.message);

    if (error instanceof SyntaxError) {
      return res.status(502).json({
        error: 'The AI returned a malformed response. Please try again.',
        details: error.message,
      });
    }

    res.status(500).json({
      error: 'Document verification failed. Please try again.',
      details: error.message,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', geminiConfigured: !!model });
});

app.listen(PORT, () => {
  console.log(`Conseal API server running on http://localhost:${PORT}`);
});

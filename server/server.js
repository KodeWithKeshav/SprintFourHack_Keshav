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

  return `You are reviewing a document for personally identifying or sensitive information (PII), following professional redaction standards.

Step 1: Identify the document's likely domain — legal, medical, financial, HR/employment, or general business — based on its content and structure.

Step 2: Apply domain-appropriate sensitivity standards:
- LEGAL documents: redact client names, SSNs, case-linked financial figures, addresses, phone numbers, opposing party details where identifying. Internal case/file reference numbers and law firm internal codenames are typically NOT sensitive unless they directly expose a client identity.
- MEDICAL documents: apply HIPAA-aligned judgment — redact patient names, dates of birth, medical record numbers, diagnoses, treatment details, provider names if identifying, contact info. Treat diagnosis/condition information as high severity, not just identifiers.
- FINANCIAL documents: redact account numbers, SSNs/tax IDs, exact balances or salary figures tied to a named individual, routing numbers, full names tied to financial detail. General aggregate figures with no individual tied to them are typically NOT sensitive.
- HR/EMPLOYMENT documents: redact employee names, SSNs, salary, performance details, employee ID numbers, home contact info.
- GENERAL/BUSINESS: use standard PII judgment — names, contact info, government IDs, financial details tied to an individual.

Step 3: For each existing annotation, judge CORRECT or FALSE_POSITIVE using the domain-appropriate standard above, with a brief reason referencing why it does or doesn't matter in this domain context.

Step 4: Independently scan the full document for sensitive information not covered by an existing annotation, using the same domain-appropriate standard, and list as MISSED.

Step 5: Assign realistic, varied confidence per item. Confidence reflects certainty this is genuinely the stated type — a clearly formatted SSN matching ###-##-#### is 0.9+; a name in ambiguous context is 0.5–0.7. Assign a severity-appropriate type label ("high", "medium", or "low"). Severity reflects consequence if exposed — government IDs, financial account numbers, medical record numbers, and diagnoses are always 'high' severity regardless of confidence.

CRITICAL INSTRUCTION FOR NAME SPANS: When identifying a name span, NEVER include honorifics or titles (Mr., Mrs., Ms., Dr., Prof., etc.) as part of the span text. The span should contain only the name itself (e.g. "Felix Hoang", not "Mr. Felix Hoang"). This keeps the sentence readable after redaction — "Ms. [REDACTED]" rather than "[REDACTED]" swallowing the title and losing the grammatical context, and avoids accidentally treating a generic title as if it were sensitive data.

Return ONLY valid JSON, no markdown, no commentary:
{
  "detectedDomain": "legal" | "medical" | "financial" | "hr" | "general",
  "verified": [
    { "text": "...", "type": "...", "originalStatus": "CORRECT" | "FALSE_POSITIVE", "confidence": 0.0-1.0, "severity": "high" | "medium" | "low", "reason": "..." }
  ],
  "missed": [
    { "text": "...", "type": "...", "confidence": 0.0-1.0, "severity": "high" | "medium" | "low", "reason": "..." }
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
      severity: item.severity || 'low',
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
      severity: item.severity || 'high',
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
        detectedDomain: llmResult.detectedDomain || 'general',
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

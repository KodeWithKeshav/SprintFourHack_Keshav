import { Fragment } from 'react';

export default function DocumentView({ documentBody, redactions, activeRedactionId, onSpanClick }) {
  if (!documentBody) return null;

  // Build the text segments intermixed with spans
  const elements = [];
  let currentIndex = 0;

  // We sort by start index to properly chunk the string
  const sortedRedactions = [...redactions].sort((a, b) => a.start - b.start);

  sortedRedactions.forEach((redaction) => {
    // Add text before the redaction
    if (redaction.start > currentIndex) {
      elements.push(
        <Fragment key={`text-${currentIndex}`}>
          {documentBody.slice(currentIndex, redaction.start)}
        </Fragment>
      );
    }

    // Determine styles based on risk and status
    let spanClass = 'px-1 transition-all duration-200 cursor-pointer ';
    let isActive = redaction.id === activeRedactionId;
    
    if (isActive) {
      spanClass += 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest ';
    }

    if (redaction.status === 'redacted' || redaction.status === 'approved') {
      spanClass += 'redaction-charcoal'; // [REDACTED: NAME] style from template
    } else if (redaction.status === 'confirmed_safe' || redaction.status === 'dismissed') {
      // Just normal text, but slightly muted
      spanClass += 'text-on-surface-variant bg-transparent';
    } else {
      // Pending
      if (redaction.highRisk) {
        spanClass += 'redaction-terracotta-risk animate-pulse'; // e.g. Missed PII
      } else {
        spanClass += 'redaction-amber-under'; // e.g. False Positive
      }
    }

    // Create the redaction span
    elements.push(
      <span
        key={redaction.id}
        id={`span-${redaction.id}`}
        className={spanClass}
        onClick={() => onSpanClick(redaction)}
        title={`${redaction.type} (Confidence: ${(redaction.confidence * 100).toFixed(0)}%)`}
      >
        {redaction.status === 'redacted' || redaction.status === 'approved' 
          ? `[REDACTED: ${redaction.type.toUpperCase()}]` 
          : documentBody.slice(redaction.start, redaction.end)}
      </span>
    );

    currentIndex = redaction.end;
  });

  // Add remaining text after the last redaction
  if (currentIndex < documentBody.length) {
    elements.push(
      <Fragment key={`text-${currentIndex}`}>
        {documentBody.slice(currentIndex)}
      </Fragment>
    );
  }

  return (
    <div className="w-full max-w-4xl shrink-0 h-max bg-surface-container-lowest border border-outline-variant/30 min-h-[1000px] shadow-sm p-12 md:p-20 flex flex-col gap-xl relative paper-card mb-xl">
      {/* Paper Header */}
      <div className="flex justify-between items-start border-b border-outline-variant/20 pb-lg">
        <div>
          <h1 className="font-display-doc text-headline-lg text-primary mb-2">Document Review</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Conseal Triage Engine</p>
        </div>
        <div className="text-right">
          <p className="font-body-ui text-label-sm text-on-surface-variant">Confidential</p>
          <p className="font-body-ui text-label-sm text-on-surface-variant italic">ID: 0049-CON-2024</p>
        </div>
      </div>

      {/* Document Content */}
      <div className="font-body-doc text-body-doc leading-loose text-on-surface text-justify whitespace-pre-wrap">
        {elements}
      </div>

      {/* Watermark Effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.02]">
        <span className="font-display-doc text-[150px] -rotate-45 uppercase border-[15px] border-primary px-20">Conseal</span>
      </div>
    </div>
  );
}

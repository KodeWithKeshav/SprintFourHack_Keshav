export default function ExportButton({ allClear, documentBody, enrichedRedactions }) {
  const handleExport = () => {
    if (!allClear || !documentBody) return;

    const redactSpans = enrichedRedactions
      .filter((r) => r.status === 'redacted' || r.status === 'approved')
      .sort((a, b) => b.start - a.start);

    let redacted = documentBody;

    for (const span of redactSpans) {
      const typeLabel = span.type.toUpperCase().replace(/_/g, '-');
      const placeholder = `[REDACTED-${typeLabel}]`;
      redacted = redacted.slice(0, span.start) + placeholder + redacted.slice(span.end);
    }

    const blob = new Blob([redacted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'redacted-document.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className={`ml-lg px-4 py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-2 ${
        allClear 
          ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary shadow-sm' 
          : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
      }`}
      onClick={handleExport}
      disabled={!allClear}
      title={allClear ? 'Download Redacted Document' : 'Resolve all items to export'}
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      Export
    </button>
  );
}

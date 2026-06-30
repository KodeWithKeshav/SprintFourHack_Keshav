export default function ConfirmModal({ redaction, onConfirmRedact, onConfirmSafe }) {
  if (!redaction) return null;

  // Prevent clicks inside the modal from bubbling to the backdrop
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1c1c19]/60 backdrop-blur-sm">
      <div 
        className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={stopPropagation}
      >
        <div className="bg-tertiary-container px-lg py-md flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-tertiary-container">warning</span>
          <h2 className="font-headline-md text-headline-md text-on-tertiary-container m-0">High-Risk Item Requires Review</h2>
        </div>

        <div className="p-lg space-y-md">
          <p className="font-body-ui text-on-surface-variant">
            The system flagged this span as potential missed PII with low confidence.
            Please verify if it is safe to leave exposed.
          </p>

          <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-md space-y-sm">
            <div className="flex justify-between">
              <span className="font-label-sm text-on-surface-variant">Type</span>
              <span className="font-body-ui font-bold text-on-surface uppercase">{redaction.type.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-label-sm text-on-surface-variant">Content</span>
              <span className="font-body-ui font-bold text-on-surface">{redaction.text}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-label-sm text-on-surface-variant">AI Confidence</span>
              <span className="font-body-ui font-bold text-on-surface">{(redaction.confidence * 100).toFixed(0)}%</span>
            </div>
            {redaction.reason && (
              <div className="pt-2 mt-2 border-t border-outline-variant/30">
                 <span className="font-label-sm text-on-surface-variant block mb-1">AI Reason</span>
                 <span className="font-body-ui text-on-surface text-sm italic">{redaction.reason}</span>
              </div>
            )}
          </div>
          
          <div className="bg-tertiary/10 border border-tertiary/20 p-sm rounded text-tertiary font-label-sm text-center">
            ⚠ Only ignore if you are absolutely certain this is not PII.
          </div>
        </div>

        <div className="bg-surface-container p-lg flex flex-col gap-sm border-t border-outline-variant/30">
          <button 
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-all"
            onClick={() => onConfirmRedact(redaction)}
          >
            Redact This
          </button>
          <button 
            className="w-full py-3 border border-outline text-on-surface-variant rounded-lg font-bold hover:bg-surface-container-high transition-all"
            onClick={() => onConfirmSafe(redaction)}
          >
            Confirm Safe to Leave Visible
          </button>
        </div>
      </div>
    </div>
  );
}

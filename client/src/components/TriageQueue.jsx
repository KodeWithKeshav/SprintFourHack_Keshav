import { useEffect, useRef } from 'react';

export default function TriageQueue({
  pendingItems,
  onDismiss,
  onApprove,
  onReviewHighRisk,
  activeRedactionId,
  onItemFocus,
}) {
  const scrollContainerRef = useRef(null);

  if (pendingItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-xl text-center opacity-50">
        <span className="material-symbols-outlined text-[48px] mb-md">task_alt</span>
        <p className="font-headline-md text-headline-md text-on-surface">Queue Empty</p>
        <p className="font-body-ui text-label-sm text-on-surface-variant">All items have been reviewed.</p>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto triage-scroll p-md space-y-md" 
      ref={scrollContainerRef}
    >
      {pendingItems.map((item) => {
        const isActive = activeRedactionId === item.id;
        const isHighRisk = item.highRisk;

        const baseCardClass = isHighRisk
          ? "bg-surface-container-lowest border border-tertiary/30 rounded-xl p-md shadow-sm group hover:border-tertiary transition-all cursor-pointer"
          : "bg-surface-container border border-outline-variant/30 rounded-xl p-md group opacity-80 hover:opacity-100 transition-all cursor-pointer";
        
        const activeClass = isActive ? " ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low" : "";

        return (
          <div
            key={item.id}
            id={`queue-${item.id}`}
            className={baseCardClass + activeClass}
            onClick={() => onItemFocus(item)}
          >
            <div className="flex justify-between items-start mb-sm">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isHighRisk ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                {isHighRisk ? 'High Risk' : 'Low Risk'}
              </span>
              <span className="text-label-sm text-on-surface-variant font-mono">{(item.confidence * 100).toFixed(0)}% Conf</span>
            </div>
            
            <h3 className="font-body-ui font-bold text-on-surface mb-1 truncate" title={item.text}>
              {item.text}
            </h3>
            <p className="text-label-sm text-on-surface-variant mb-md leading-tight">
              Type: {item.type.replace(/_/g, ' ')}
              {item.reason && <span className="block mt-1 italic opacity-80 truncate">{item.reason}</span>}
            </p>

            <div className="flex gap-sm" onClick={(e) => e.stopPropagation()}>
              {isHighRisk ? (
                <>
                  <button 
                    className="flex-1 bg-primary-container text-on-primary-container py-2 rounded-lg text-label-sm font-bold hover:bg-primary transition-all flex items-center justify-center gap-xs shadow-sm"
                    onClick={() => onReviewHighRisk(item)}
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Review
                  </button>
                  <button className="px-3 bg-secondary-container text-on-secondary-container rounded-lg hover:bg-outline-variant/30 transition-all">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="flex-1 border border-outline-variant text-on-surface-variant py-2 rounded-lg text-label-sm font-medium hover:bg-surface-container-high transition-all"
                    onClick={() => onApprove(item)}
                  >
                    Confirm Redaction
                  </button>
                  <button 
                    className="px-3 text-on-surface-variant/40 hover:text-error transition-all" 
                    title="Dismiss"
                    onClick={() => onDismiss(item)}
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

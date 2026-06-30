import { useState, useRef, useEffect } from 'react';

export default function TriageQueue({
  pendingItems,
  onDismiss,
  onApprove,
  onReviewHighRisk,
  activeRedactionId,
  onItemFocus,
  onSkip,
  decisionLog = [],
  undo,
}) {
  const scrollContainerRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedReasonId, setExpandedReasonId] = useState(null);
  const [showAutoResolved, setShowAutoResolved] = useState(false);

  const autoResolvedItems = decisionLog.filter(log => log.actor === 'System (Auto)');
  const autoRedactedCount = autoResolvedItems.filter(log => log.action === 'auto-redacted').length;
  const autoSafeCount = autoResolvedItems.filter(log => log.action === 'auto-safe').length;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div 
      className="flex-1 overflow-y-auto triage-scroll p-md space-y-md flex flex-col" 
      ref={scrollContainerRef}
    >
      {/* Auto-Resolved Summary Panel */}
      {autoResolvedItems.length > 0 && (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 mb-2">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowAutoResolved(!showAutoResolved)}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Auto-Resolved by System</p>
                <p className="text-xs text-on-surface-variant">
                  {autoRedactedCount} auto-redacted, {autoSafeCount} marked safe
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: showAutoResolved ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </div>

          {showAutoResolved && (
            <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 triage-scroll border-t border-outline-variant/20 pt-4">
              {autoResolvedItems.map(log => (
                <div key={log.id} className="flex justify-between items-center bg-surface-container px-3 py-2 rounded border border-outline-variant/30 group">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-[2px] rounded-full uppercase tracking-wider ${log.action === 'auto-redacted' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {log.action === 'auto-redacted' ? 'Redacted' : 'Safe'}
                      </span>
                      <span className="text-xs font-bold text-on-surface truncate">{log.text}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant truncate">
                      {(log.confidence * 100).toFixed(0)}% · {log.piiType}
                    </p>
                  </div>
                  <button 
                    onClick={() => undo(log.id)}
                    className="opacity-0 group-hover:opacity-100 text-[11px] font-bold text-primary hover:text-primary-container transition-opacity flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">undo</span>
                    Undo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {pendingItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-xl text-center opacity-50 mt-8">
          <span className="material-symbols-outlined text-[48px] mb-md">task_alt</span>
          <p className="font-headline-md text-headline-md text-on-surface">Queue Empty</p>
          <p className="font-body-ui text-label-sm text-on-surface-variant">All items have been reviewed.</p>
        </div>
      ) : (
        pendingItems.map((item) => {
        const isActive = activeRedactionId === item.id;
        const isHighRisk = item.highRisk;
        const isMenuOpen = openMenuId === item.id;
        const showReason = expandedReasonId === item.id;

        // Review Status Tag logic
        let statusTag = '';
        let statusTagClass = '';
        if (item.source === 'missed') {
          statusTag = 'Needs Confirmation';
          statusTagClass = 'bg-tertiary-container text-on-tertiary-container';
        } else if (item.groundTruth === 'correct') {
          statusTag = 'Confirm to Redact';
          statusTagClass = 'bg-primary-container text-on-primary-container';
        } else {
          statusTag = 'Quick Check';
          statusTagClass = 'bg-surface-container-high text-on-surface-variant';
        }

        // Sensitivity Tag logic
        const typeLower = item.type?.toLowerCase() || '';
        let sensitivityTag = 'General PII';
        if (typeLower.includes('name') || typeLower.includes('ssn') || typeLower.includes('id')) {
          sensitivityTag = 'Identifier';
        } else if (typeLower.includes('phone') || typeLower.includes('email') || typeLower.includes('address')) {
          sensitivityTag = 'Contact Info';
        } else if (typeLower.includes('medical') || typeLower.includes('diagnosis')) {
          sensitivityTag = 'Medical';
        } else if (typeLower.includes('account') || typeLower.includes('financial') || typeLower.includes('salary') || typeLower.includes('balance')) {
          sensitivityTag = 'Financial';
        } else if (typeLower.includes('reference') || typeLower.includes('case')) {
          sensitivityTag = 'Reference';
        }

        const activeRing = isActive ? " ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low" : "";

        return (
          <div
            key={item.id}
            id={`queue-${item.id}`}
            className={`bg-surface-container-lowest border rounded-xl p-4 group hover:shadow-md transition-all duration-200 cursor-pointer relative ${isHighRisk ? 'border-tertiary/30 shadow-sm' : 'border-outline-variant/20 hover:border-outline-variant/40'}${activeRing}`}
            onClick={() => onItemFocus(item)}
          >
            {/* Row 1: Tags row */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className={`text-[9px] font-bold leading-none px-2 py-[3px] rounded-full uppercase tracking-wider ${statusTagClass}`}>
                {statusTag}
              </span>
              <span className="text-[9px] font-bold leading-none px-2 py-[3px] rounded-full uppercase tracking-wider text-on-surface-variant/70 bg-surface-container border border-outline-variant/20">
                {sensitivityTag}
              </span>
              <span className="ml-auto text-[10px] text-on-surface-variant/50 font-mono tabular-nums">
                {(item.confidence * 100).toFixed(0)}%
              </span>
            </div>
            
            {/* Row 2: PII Value */}
            <p className="text-[13px] font-bold text-on-surface truncate leading-tight mb-0.5" title={item.text}>
              {item.text}
            </p>
            <p className="text-[11px] text-on-surface-variant/50 mb-3 capitalize">
              {item.type.replace(/_/g, ' ')}
            </p>

            {/* Reason Expansion */}
            {showReason && item.reason && (
              <div className="bg-surface-variant/15 border border-outline-variant/10 rounded-lg px-3 py-2 mb-3 text-[11px] text-on-surface-variant italic leading-relaxed">
                {item.reason}
              </div>
            )}

            {/* Row 3: Actions */}
            <div className="flex gap-2 items-stretch" onClick={(e) => e.stopPropagation()}>
              <button 
                className={`flex-1 py-[6px] rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${
                  isHighRisk 
                    ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm' 
                    : 'border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                onClick={() => isHighRisk ? onReviewHighRisk(item) : onApprove(item)}
              >
                <span className="material-symbols-outlined text-[14px]">{isHighRisk ? 'visibility' : 'check_circle'}</span>
                {isHighRisk ? 'Review' : 'Confirm'}
              </button>

              {/* Three Dot Menu */}
              <div className="relative">
                <button 
                  className="h-full aspect-square flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant/40 hover:bg-surface-container-high hover:text-on-surface transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(isMenuOpen ? null : item.id);
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-xl z-50 py-1 flex flex-col overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                    <button 
                      className="px-3 py-2 text-left text-[12px] hover:bg-surface-container text-on-surface flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedReasonId(showReason ? null : item.id);
                        setOpenMenuId(null);
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">{showReason ? 'visibility_off' : 'visibility'}</span>
                      {showReason ? 'Hide reason' : 'View reason'}
                    </button>
                    <button 
                      className="px-3 py-2 text-left text-[12px] hover:bg-surface-container text-on-surface flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(item);
                        setOpenMenuId(null);
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                      Dismiss as false positive
                    </button>
                    <button 
                      className="px-3 py-2 text-left text-[12px] hover:bg-surface-container text-on-surface flex items-center gap-2 border-t border-outline-variant/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSkip(item);
                        setOpenMenuId(null);
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px]">skip_next</span>
                      Skip for now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        })
      )}
    </div>
  );
}

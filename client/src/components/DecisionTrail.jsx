import { useState } from 'react';

export default function DecisionTrail({ decisionLog, onUndo }) {
  const [isOpen, setIsOpen] = useState(false);

  if (decisionLog.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(107,92,74,0.08)] transition-all duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
      
      {/* Header / Toggle */}
      <div 
        className="h-12 px-margin-page flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-on-surface-variant">
            {isOpen ? 'expand_more' : 'expand_less'}
          </span>
          <span className="font-label-caps text-label-caps text-on-surface">Decision Trail</span>
          <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">
            {decisionLog.length} items
          </span>
        </div>
        {!isOpen && (
          <span className="font-label-sm text-on-surface-variant italic">
            Last action: {decisionLog[0].action}
          </span>
        )}
      </div>

      {/* Log Content */}
      <div className="h-64 overflow-y-auto p-md border-t border-outline-variant/20 bg-surface-container/30">
        <div className="max-w-4xl mx-auto space-y-sm">
          {decisionLog.map((log) => (
            <div 
              key={log.id}
              className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 p-sm rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-label-sm font-bold text-on-surface">
                  {log.action} <span className="font-normal text-on-surface-variant mx-1">on</span> "{log.text}"
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {log.action !== 'undone' && (
                <button 
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 rounded font-label-caps text-[10px] text-on-surface-variant transition-colors flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUndo(log.id);
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">undo</span>
                  Undo
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

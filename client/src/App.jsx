import { useState, useCallback } from 'react';
import { fetchDocument, verifyDocument } from './api';
import { useRedactionState } from './hooks/useRedactionState';
import UploadView from './components/UploadView';
import DocumentView from './components/DocumentView';
import TriageQueue from './components/TriageQueue';
import ExposureMeter from './components/ExposureMeter';
import ConfirmModal from './components/ConfirmModal';
import DecisionTrail from './components/DecisionTrail';
import ExportButton from './components/ExportButton';
import SettingsView from './components/SettingsView';
import PiiLibrariesView from './components/PiiLibrariesView';
import AutomationsView from './components/AutomationsView';
import DirectoryView from './components/DirectoryView';
import AuditLogsView from './components/AuditLogsView';
import HelpCenterView from './components/HelpCenterView';

export default function App() {
  const [currentView, setCurrentView] = useState('workspace');
  const [document, setDocument] = useState(null);
  const [redactions, setRedactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRedactionId, setActiveRedactionId] = useState(null);
  const [modalRedaction, setModalRedaction] = useState(null);
  
  // Toast state for unimplemented features
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleNotImplemented = useCallback((e) => {
    e.preventDefault();
    showToast("This feature is not available in the prototype.");
  }, [showToast]);

  const {
    enrichedRedactions,
    pendingItems,
    highRiskPending,
    totalPending,
    highRiskCount,
    totalItems,
    allClear,
    decisionLog,
    dismissFalsePositive,
    confirmRedact,
    confirmSafe,
    approveRedaction,
    undo,
    reset,
  } = useRedactionState(redactions);

  const handleAnalyze = useCallback(async (documentText, annotations) => {
    try {
      setLoading(true);
      setError(null);
      const data = await verifyDocument(documentText, annotations);
      setDocument(data.document);
      setRedactions(data.redactions);
      setCurrentView('workspace');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUseDemoDocument = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocument();
      setDocument(data.document);
      setRedactions(data.redactions);
      setCurrentView('workspace');
    } catch (err) {
      setError(err.message || 'Failed to load demo document.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewDocument = () => {
    setDocument(null);
    setRedactions([]);
    reset();
    setCurrentView('workspace');
  };

  const handleSpanClick = useCallback((redaction) => {
    setActiveRedactionId(redaction.id);
    const queueItem = window.document.getElementById(`queue-${redaction.id}`);
    if (queueItem) {
      queueItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleItemFocus = useCallback((redaction) => {
    setActiveRedactionId(redaction.id);
    const span = window.document.getElementById(`span-${redaction.id}`);
    if (span) {
      span.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleDismiss = useCallback((redaction) => {
    dismissFalsePositive(redaction);
    setActiveRedactionId(null);
  }, [dismissFalsePositive]);

  const handleApprove = useCallback((redaction) => {
    approveRedaction(redaction);
    setActiveRedactionId(null);
  }, [approveRedaction]);

  const handleReviewHighRisk = useCallback((redaction) => {
    setModalRedaction(redaction);
  }, []);

  const handleModalRedact = useCallback((redaction) => {
    confirmRedact(redaction);
    setModalRedaction(null);
    setActiveRedactionId(null);
  }, [confirmRedact]);

  const handleModalSafe = useCallback((redaction) => {
    confirmSafe(redaction);
    setModalRedaction(null);
    setActiveRedactionId(null);
  }, [confirmSafe]);

  return (
    <>
      {/* Top Header */}
      <header className="w-full top-0 sticky border-b border-outline-variant/30 bg-surface-container-low shadow-sm z-50">
        <div className="flex justify-between items-center px-lg py-md h-20 w-full">
          <div className="flex items-center gap-xl w-2/3">
            <h1 className="font-display-doc text-display-doc text-primary italic font-bold">Conseal</h1>
            <nav className="flex items-center gap-md">
              <button 
                onClick={() => setCurrentView('workspace')} 
                className={`font-label-caps tracking-widest uppercase transition-colors duration-200 px-3 py-2 rounded-lg ${currentView === 'workspace' ? 'text-primary border-b-2 border-primary rounded-b-none pb-[6px]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Workspace
              </button>
              <button 
                onClick={() => setCurrentView('directory')} 
                className={`font-label-caps tracking-widest uppercase transition-colors duration-200 px-3 py-2 rounded-lg ${currentView === 'directory' ? 'text-primary border-b-2 border-primary rounded-b-none pb-[6px]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Directory
              </button>
              <button 
                onClick={() => setCurrentView('automations')} 
                className={`font-label-caps tracking-widest uppercase transition-colors duration-200 px-3 py-2 rounded-lg ${currentView === 'automations' ? 'text-primary border-b-2 border-primary rounded-b-none pb-[6px]' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                Automation
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            {currentView === 'workspace' && document && (
              <>
                <ExposureMeter
                  highRiskCount={highRiskCount}
                  totalPending={totalPending}
                  allClear={allClear}
                />
                <ExportButton
                  allClear={allClear}
                  documentBody={document?.body}
                  enrichedRedactions={enrichedRedactions}
                />
              </>
            )}
            <div className="flex items-center gap-sm ml-lg">
              <button onClick={handleNotImplemented} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button onClick={handleNotImplemented} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined">account_circle</span>
                <span className="text-label-sm hidden lg:inline">Legal Dept.</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Column: SideNavBar */}
        <aside className="hidden md:flex h-full w-64 flex-shrink-0 bg-surface-container-low dark:bg-surface-container border-r border-outline-variant/20 flex-col py-lg px-md gap-md">
          <div className="mb-lg flex items-center gap-md px-2">
            <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-on-surface">Redaction Suite</span>
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">Precision Review</span>
            </div>
          </div>
          <button 
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-sm mb-md active:scale-[0.98]"
            onClick={handleNewDocument}
          >
            <span className="material-symbols-outlined">add</span>
            New Redaction
          </button>
          <nav className="flex-1 space-y-1">
            <p className="font-label-caps text-label-caps tracking-widest text-on-surface-variant mb-md px-2 uppercase">Menu</p>
            <div 
              className={`font-bold rounded-lg px-3 py-3 flex items-center gap-md cursor-pointer transition-all active:translate-x-1 ${currentView === 'workspace' ? 'text-on-primary-fixed bg-primary-fixed-dim/20' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50'}`}
              onClick={() => setCurrentView('workspace')}
            >
              <span className="material-symbols-outlined">description</span>
              <span>Documents</span>
            </div>
            <div 
              className={`font-bold rounded-lg px-3 py-3 flex items-center gap-md cursor-pointer transition-all active:translate-x-1 ${currentView === 'libraries' ? 'text-on-primary-fixed bg-primary-fixed-dim/20' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50'}`}
              onClick={() => setCurrentView('libraries')}
            >
              <span className="material-symbols-outlined">book</span>
              <span>PII Libraries</span>
            </div>
            <div 
              className={`font-bold rounded-lg px-3 py-3 flex items-center gap-md cursor-pointer transition-all active:translate-x-1 ${currentView === 'audit' ? 'text-on-primary-fixed bg-primary-fixed-dim/20' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50'}`}
              onClick={() => setCurrentView('audit')}
            >
              <span className="material-symbols-outlined">history</span>
              <span>Audit Logs</span>
            </div>
            <div 
              className={`font-bold rounded-lg px-3 py-3 flex items-center gap-md cursor-pointer transition-all active:translate-x-1 ${currentView === 'settings' ? 'text-on-primary-fixed bg-primary-fixed-dim/20' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50'}`}
              onClick={() => setCurrentView('settings')}
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </div>
          </nav>
          <div className="mt-auto border-t border-outline-variant/20 pt-md">
            <div 
              className={`font-bold rounded-lg px-3 py-3 flex items-center gap-md cursor-pointer transition-all ${currentView === 'help' ? 'text-on-primary-fixed bg-primary-fixed-dim/20' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50'}`}
              onClick={() => setCurrentView('help')}
            >
              <span className="material-symbols-outlined">help</span>
              <span>Help Center</span>
            </div>
            <div className="flex items-center gap-md px-3 py-4 mt-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim border border-outline flex items-center justify-center text-secondary font-bold">JD</div>
              <div>
                <p className="text-label-sm font-bold leading-none">James Donovan</p>
                <p className="text-[10px] text-on-surface-variant">Lead Counsel</p>
              </div>
            </div>
          </div>
        </aside>

        {currentView === 'workspace' && (
          !document ? (
            <UploadView
              onAnalyze={handleAnalyze}
              onUseDemoDocument={handleUseDemoDocument}
              isAnalyzing={loading}
              error={error}
            />
          ) : (
            <>
              {/* Center Column: Main Workspace */}
              <main className="flex-1 bg-surface-container/30 relative overflow-y-auto p-margin-page flex flex-col items-center">
                <DocumentView
                  documentBody={document?.body}
                  redactions={enrichedRedactions}
                  activeRedactionId={activeRedactionId}
                  onSpanClick={handleSpanClick}
                />
              </main>

              {/* Right Column: Triage Panel */}
              <aside className="w-80 h-full bg-surface-container-low border-l border-outline-variant/20 flex flex-col">
                <div className="p-lg border-b border-outline-variant/20">
                  <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                      Triage Queue
                      <span className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary text-[10px] flex items-center justify-center">{totalPending}</span>
                  </h2>
                  <p className="text-label-sm text-on-surface-variant mt-1">Requiring manual intervention</p>
                </div>
                <TriageQueue
                  pendingItems={pendingItems}
                  onDismiss={handleDismiss}
                  onApprove={handleApprove}
                  onReviewHighRisk={handleReviewHighRisk}
                  activeRedactionId={activeRedactionId}
                  onItemFocus={handleItemFocus}
                />
              </aside>
              
              <DecisionTrail decisionLog={decisionLog} onUndo={undo} />
            </>
          )
        )}
        
        {currentView === 'directory' && <DirectoryView />}
        {currentView === 'automations' && <AutomationsView />}
        {currentView === 'libraries' && <PiiLibrariesView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'audit' && <AuditLogsView />}
        {currentView === 'help' && <HelpCenterView />}
      </div>

      {modalRedaction && (
        <ConfirmModal
          redaction={modalRedaction}
          onConfirmRedact={handleModalRedact}
          onConfirmSafe={handleModalSafe}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-inverse-surface text-on-inverse-surface px-6 py-3 rounded-lg shadow-lg font-label-sm flex items-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">info</span>
            {toastMessage}
          </div>
        </div>
      )}
    </>
  );
}

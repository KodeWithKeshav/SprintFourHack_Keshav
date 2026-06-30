import { useState, useRef } from 'react';

export default function UploadView({ onAnalyze, onUseDemoDocument, isAnalyzing, error }) {
  const [documentText, setDocumentText] = useState('');
  const [annotationsText, setAnnotationsText] = useState('');
  const [parseError, setParseError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setParseError(null);

      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (parsed.documentText) {
            setDocumentText(parsed.documentText);
            if (parsed.annotations && Array.isArray(parsed.annotations)) {
              setAnnotationsText(JSON.stringify(parsed.annotations, null, 2));
            } else {
              setAnnotationsText('');
            }
          } else {
            setDocumentText(content);
            setAnnotationsText('');
          }
        } catch {
          setParseError('Invalid JSON file. Please check the format.');
        }
      } else {
        setDocumentText(content);
        setAnnotationsText('');
      }
      setShowManualEntry(true); // Show the fields after file upload to let them submit or edit
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.json'))) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileUpload({ target: fileInputRef.current });
    } else {
      setParseError('Only .txt and .json files are supported.');
    }
  };

  const handleSubmit = () => {
    if (!documentText.trim()) return;

    let annotations = [];
    if (annotationsText.trim()) {
      try {
        annotations = JSON.parse(annotationsText);
        if (!Array.isArray(annotations)) {
          setParseError('Annotations must be a JSON array.');
          return;
        }
      } catch {
        setParseError('Invalid JSON in annotations field.');
        return;
      }
    }

    // Parse inline annotations: [[text|type]] or [[text]]
    let cleanDocumentText = documentText;
    const inlineAnnotations = [];
    const regex = /\[\[(.+?)(?:\|(.+?))?\]\]/g;
    
    // Replace markers with just the text while recording the annotations
    cleanDocumentText = cleanDocumentText.replace(regex, (match, text, type) => {
      // Strip leading honorifics for name redactions to avoid swallowing titles
      const honorificRegex = /^(?:Mr\.|Mrs\.|Ms\.|Miss|Dr\.|Prof\.|Mr|Mrs|Ms|Dr|Prof)\s+/i;
      const strippedText = text.replace(honorificRegex, '');
      
      inlineAnnotations.push({
        text: strippedText,
        type: type || 'unspecified'
      });
      return text; // Return the full text (including honorific) to preserve it in the document
    });

    // Merge inline with JSON (JSON wins on duplicate text)
    if (inlineAnnotations.length > 0) {
      const mergedMap = new Map();
      inlineAnnotations.forEach(ann => mergedMap.set(ann.text, ann));
      annotations.forEach(ann => mergedMap.set(ann.text, ann));
      annotations = Array.from(mergedMap.values());
    }

    setParseError(null);
    onAnalyze(cleanDocumentText, annotations);
  };

  const hasContent = documentText.trim().length > 0;

  return (
    <main className="flex-grow p-margin-page relative w-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-xl pb-margin-page">
        {/* Hero Section */}
        <section className="text-center space-y-md py-lg">
          <h1 className="font-display-doc text-5xl lg:text-6xl text-on-surface max-w-3xl mx-auto">
            Secure Redaction Studio
          </h1>
          <p className="font-body-doc text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
            Precision AI-driven PII detection meeting the gold standard of <span className="italic font-bold">Digital Parchment</span> protocols. 
            Irreversible, legal-grade protection for your most sensitive records.
          </p>
        </section>

        {(parseError || error) && (
          <div className="bg-error-container text-on-error-container p-md rounded-lg border border-error/30 flex items-center gap-sm shadow-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{parseError || error}</span>
          </div>
        )}

        {/* Upload Area */}
        <section className="w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div 
            className={`paper-card w-full p-12 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-lg transition-all duration-300 group cursor-pointer hover:border-primary/40 ${isDragActive ? 'border-primary bg-primary/5' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary text-5xl" style={{fontVariationSettings: "'wght' 200"}}>upload_file</span>
            </div>
            <div className="text-center space-y-xs">
              <h3 className="font-headline-lg text-headline-lg text-on-surface">Drag and drop or browse your library</h3>
              <p className="font-body-ui text-on-surface-variant">Support for .txt and .json files</p>
            </div>
            
            {/* Security Badges */}
            <div className="flex gap-xl pt-md border-t border-outline-variant/30 w-full justify-center">
              <div className="flex items-center gap-sm text-on-surface-variant/70">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-label-caps text-[10px] uppercase tracking-tighter">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant/70">
                <span className="material-symbols-outlined text-[18px]">lan</span>
                <span className="font-label-caps text-[10px] uppercase tracking-tighter">Local-First Processing</span>
              </div>
              <div className="flex items-center gap-sm text-on-surface-variant/70">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span className="font-label-caps text-[10px] uppercase tracking-tighter">Legal Compliance Ready</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Manual Entry Toggle */}
        <div className="flex justify-center my-md">
          <button 
            className="text-primary font-label-caps text-label-caps tracking-widest hover:bg-primary-container/20 px-4 py-2 rounded transition-all"
            onClick={() => setShowManualEntry(!showManualEntry)}
          >
            {showManualEntry ? 'HIDE MANUAL ENTRY' : 'OR PASTE RAW TEXT'}
          </button>
        </div>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <section className="paper-card p-lg space-y-md animate-[fadeIn_0.3s_ease-out]">
            <div className="space-y-sm">
              <label className="font-headline-md text-headline-md text-on-surface block">
                Document Text <span className="text-on-surface-variant font-normal text-sm ml-2">Optionally mark redactions inline using [[text|type]], e.g. [[John Doe|name]]</span>
              </label>
              <textarea
                className="w-full h-64 p-md bg-surface-container-low border border-outline-variant rounded-lg font-body-doc text-body-doc text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="Paste the full document text here. You can use [[text|type]] markers to manually tag PII..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
              />
            </div>
            
            <div className="pt-md border-t border-outline-variant/30 flex justify-end gap-md">
              <button
                className="px-6 py-2 rounded-lg font-bold border border-outline text-on-surface-variant hover:bg-surface-container-high transition-all"
                onClick={onUseDemoDocument}
                disabled={isAnalyzing}
              >
                Use Demo Document
              </button>
              <button
                className="px-6 py-2 rounded-lg font-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={!hasContent || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    Analyze Document
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {!showManualEntry && (
          <div className="flex justify-center mt-xl">
             <button
                className="px-8 py-3 rounded-xl font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all"
                onClick={onUseDemoDocument}
                disabled={isAnalyzing}
              >
                Skip & Use Demo Document
              </button>
          </div>
        )}

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg pt-xl">
          <div className="paper-card p-lg space-y-md">
            <div className="w-12 h-12 bg-secondary-container rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>auto_fix_high</span>
            </div>
            <h4 className="font-headline-md text-headline-md">AI Assisted</h4>
            <p className="font-body-ui text-on-surface-variant">
              Neural models trained specifically on legal and medical ontologies for 99.9% PII detection accuracy across diverse layouts.
            </p>
          </div>
          <div className="paper-card p-lg space-y-md">
            <div className="w-12 h-12 bg-primary-container rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>history_edu</span>
            </div>
            <h4 className="font-headline-md text-headline-md">Legal Grade</h4>
            <p className="font-body-ui text-on-surface-variant">
              Every modification is logged in an immutable audit trail, providing a chain of custody required for high-stakes discovery.
            </p>
          </div>
          <div className="paper-card p-lg space-y-md">
            <div className="w-12 h-12 bg-tertiary-container rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container" style={{fontVariationSettings: "'FILL' 1"}}>layers_clear</span>
            </div>
            <h4 className="font-headline-md text-headline-md">Irreversible</h4>
            <p className="font-body-ui text-on-surface-variant">
              Unlike standard PDF editors, Conseal physically replaces byte data, ensuring redactions can never be unmasked or recovered.
            </p>
          </div>
        </section>

        {/* Bottom Decorative/Utility Area */}
        <footer className="pt-xl opacity-60 flex justify-between items-center text-on-surface-variant">
          <div className="flex gap-md items-center">
            <span className="font-label-caps text-[11px]">VERSION 4.2.0-STABLE</span>
            <div className="h-1 w-1 bg-outline-variant rounded-full"></div>
            <span className="font-label-caps text-[11px]">WORKSPACE: INTERNAL_LEGAL_P4</span>
          </div>
          <div className="flex gap-lg">
            <a className="font-label-caps text-[11px] hover:text-primary transition-colors" href="#">Privacy Charter</a>
            <a className="font-label-caps text-[11px] hover:text-primary transition-colors" href="#">Key Management</a>
          </div>
        </footer>
      </div>
    </main>
  );
}

import { useState } from 'react';

export default function PiiLibrariesView() {
  const [libraries, setLibraries] = useState([
    {
      title: "Full Names",
      icon: "person",
      patterns: 12,
      active: true,
      description: "Detects given names, surnames, and honorifics across multiple languages and cultural formats.",
      tag: "CRITICALITY: HIGH"
    },
    {
      title: "Social Security",
      icon: "fingerprint",
      patterns: 4,
      active: true,
      description: "Identifies government-issued identification numbers including SSN, TIN, and ITIN formats.",
      tag: "STRICT MASKING"
    },
    {
      title: "Email Addresses",
      icon: "mail",
      patterns: 8,
      active: true,
      description: "Matches standard email formats and handles complex internal routing address obfuscation.",
      tag: "REGEX BASED"
    },
    {
      title: "Phone Numbers",
      icon: "call",
      patterns: 0,
      active: false,
      description: "Global phone number recognition including international country codes and regional formatting.",
      tag: "INACTIVE"
    },
    {
      title: "Physical Addresses",
      icon: "location_on",
      patterns: 22,
      active: true,
      description: "Detects residential addresses, PO boxes, and commercial locations globally.",
      tag: "GEO-AWARE"
    }
  ]);

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showNewCustomForm, setShowNewCustomForm] = useState(false);
  const [newCustomData, setNewCustomData] = useState({ title: '', example: '' });
  const [newPatternData, setNewPatternData] = useState('');

  const toggleLibrary = (index) => {
    setLibraries(prev => prev.map((lib, i) => {
      if (i !== index) return lib;
      const nowActive = !lib.active;
      return {
        ...lib,
        active: nowActive,
        tag: nowActive ? (lib.tag === 'INACTIVE' ? 'CUSTOM PATTERN' : lib.tag.replace('INACTIVE', 'ENABLED')) : 'INACTIVE'
      };
    }));
  };

  const handleConfigureClick = (index) => {
    const lib = libraries[index];
    if (!lib.active) {
      toggleLibrary(index);
    } else {
      setExpandedIndex(expandedIndex === index ? null : index);
      setNewPatternData('');
    }
  };

  const handleAddPattern = (index) => {
    if (!newPatternData.trim()) return;
    setLibraries(prev => prev.map((lib, i) => {
      if (i !== index) return lib;
      return { ...lib, patterns: lib.patterns + 1 };
    }));
    setNewPatternData('');
  };

  const handleAddCustom = () => {
    if (!newCustomData.title.trim()) return;
    setLibraries(prev => [
      ...prev,
      {
        title: newCustomData.title,
        icon: "build",
        patterns: newCustomData.example ? 1 : 0,
        active: true,
        description: "Custom user-defined PII category.",
        tag: "CUSTOM PATTERN"
      }
    ]);
    setShowNewCustomForm(false);
    setNewCustomData({ title: '', example: '' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-surface">
      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="font-headline-lg text-[32px] font-bold text-on-surface mb-4">PII Libraries</h1>
        <p className="text-on-surface-variant font-body-doc italic text-lg max-w-4xl mb-12 leading-relaxed">
          Manage automated identification patterns for sensitive data. Configure which categories are flagged during document scanning to ensure compliance with privacy regulations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {libraries.map((lib, i) => (
            <div key={i} className={`paper-card rounded-xl p-8 flex flex-col gap-4 relative overflow-hidden transition-all ${!lib.active ? 'opacity-70 grayscale-[0.3]' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-secondary shadow-sm">
                  <span className="material-symbols-outlined">{lib.icon}</span>
                </div>
                {/* Toggle switch */}
                <button
                  onClick={() => toggleLibrary(i)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${lib.active ? 'bg-primary justify-end' : 'bg-surface-variant justify-start border border-outline-variant/50'}`}
                  aria-label={`Toggle ${lib.title}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all"></div>
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-headline-md text-xl font-bold text-on-surface">{lib.title}</h3>
                <p className="flex items-center gap-2 text-sm mt-2 font-medium">
                  <span className={`w-2 h-2 rounded-full ${lib.active ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                  <span className={lib.active ? 'text-primary' : 'text-on-surface-variant'}>{lib.patterns} patterns active</span>
                </p>
              </div>

              <p className="text-on-surface-variant text-sm flex-1 mt-2 leading-relaxed">
                {lib.description}
              </p>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">{lib.tag}</span>
                <button 
                  className="text-sm font-bold uppercase tracking-wide text-primary hover:text-primary-container"
                  onClick={() => handleConfigureClick(i)}
                >
                  {lib.active ? (expandedIndex === i ? 'Close' : 'Configure') : 'Enable'}
                </button>
              </div>

              {/* Expanded Configure Area */}
              {expandedIndex === i && lib.active && (
                <div className="mt-4 p-4 bg-surface-container border border-outline-variant/30 rounded-lg animate-[fadeIn_0.2s_ease-out]">
                  <p className="text-label-sm font-bold text-on-surface mb-2">Active Patterns</p>
                  <ul className="space-y-2 mb-4">
                    <li className="text-sm text-on-surface-variant bg-surface-container-low px-3 py-2 rounded border border-outline-variant/20 flex justify-between items-center">
                      <span className="font-mono text-xs">Example RegEx or Format...</span>
                      <span className="material-symbols-outlined text-[16px] text-error cursor-pointer">delete</span>
                    </li>
                  </ul>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add new pattern (e.g. \d{4})" 
                      className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                      value={newPatternData}
                      onChange={(e) => setNewPatternData(e.target.value)}
                    />
                    <button 
                      className="bg-primary text-on-primary px-3 py-1.5 rounded text-sm font-bold hover:bg-primary-container transition-all"
                      onClick={() => handleAddPattern(i)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Custom Pattern Card */}
          {!showNewCustomForm ? (
            <div 
              className="rounded-xl p-8 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-primary/40 hover:bg-surface-container-lowest/50 transition-all group min-h-[320px]"
              onClick={() => setShowNewCustomForm(true)}
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary-fixed-dim/20 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined">add</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">Custom Pattern</h3>
                <p className="text-on-surface-variant text-sm px-4">
                  Define your own proprietary data formats or project-specific PII needs.
                </p>
              </div>
            </div>
          ) : (
            <div className="paper-card rounded-xl p-8 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-headline-md text-xl font-bold text-on-surface">New Pattern</h3>
                <button onClick={() => setShowNewCustomForm(false)} className="text-on-surface-variant hover:text-error transition-all">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Employee ID" 
                    className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    value={newCustomData.title}
                    onChange={(e) => setNewCustomData({ ...newCustomData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-label-sm font-bold text-on-surface block mb-1">Example Format</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EMP-\d{5}" 
                    className="w-full bg-surface-container border border-outline-variant/50 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    value={newCustomData.example}
                    onChange={(e) => setNewCustomData({ ...newCustomData, example: e.target.value })}
                  />
                </div>
                <button 
                  className="w-full bg-primary text-on-primary font-bold py-2 rounded hover:bg-primary-container transition-all"
                  onClick={handleAddCustom}
                >
                  Create Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

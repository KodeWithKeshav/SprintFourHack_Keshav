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

  const toggleLibrary = (index) => {
    setLibraries(prev => prev.map((lib, i) => {
      if (i !== index) return lib;
      const nowActive = !lib.active;
      return {
        ...lib,
        active: nowActive,
        patterns: nowActive ? (lib.patterns || 4) : 0,
        tag: nowActive ? lib.tag.replace('INACTIVE', 'ENABLED') : 'INACTIVE'
      };
    }));
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
                <button className="text-sm font-bold uppercase tracking-wide text-primary hover:text-primary-container">
                  {lib.active ? 'Configure' : 'Enable'}
                </button>
              </div>
            </div>
          ))}

          {/* Custom Pattern Card */}
          <div className="rounded-xl p-8 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-primary/40 hover:bg-surface-container-lowest/50 transition-all group min-h-[320px]">
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
        </div>
      </div>
    </div>
  );
}

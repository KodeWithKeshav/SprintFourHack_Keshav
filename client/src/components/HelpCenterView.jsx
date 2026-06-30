import { useState } from 'react';

export default function HelpCenterView() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: "Getting Started",
      icon: "rocket_launch",
      description: "A quick guide to setting up your first legal redaction project."
    },
    {
      title: "Confidence Scores",
      icon: "bar_chart",
      description: "Understand how our AI calculates the accuracy of PII detection."
    },
    {
      title: "Reviewing Items",
      icon: "fact_check",
      description: "Best practices for validating and confirming suggested redactions."
    },
    {
      title: "Exporting Docs",
      icon: "file_export",
      description: "Learn how to finalize and export securely redacted PDF and TIFF files."
    },
    {
      title: "Redaction Rules",
      icon: "gavel",
      description: "Configure custom PII patterns and automated exclusion lists."
    },
    {
      title: "Account & Settings",
      icon: "manage_accounts",
      description: "Manage team seats, billing, and organizational security policies."
    }
  ];

  const faqs = [
    {
      question: "How does Conseal ensure HIPAA compliance?",
      answer: "Conseal is designed with HIPAA compliance at its core. All document processing occurs in encrypted memory spaces, PII is never stored in plaintext, and our audit trail provides the chain-of-custody documentation required by HIPAA's Privacy and Security Rules. We also support BAA agreements for enterprise clients."
    },
    {
      question: "Can I use custom PII patterns for specific litigation?",
      answer: "Yes. Navigate to the PII Libraries page to create custom detection patterns. You can define regex-based rules, keyword lists, and contextual patterns tailored to your specific case requirements. Custom patterns are scoped per workspace and can be shared across team members."
    },
    {
      question: "What file formats are supported for ingestion?",
      answer: "Currently, Conseal supports .txt and .json file formats for document ingestion. JSON files can include pre-annotated PII markers for verification workflows. Support for PDF, DOCX, and scanned image (OCR) formats is on our roadmap for Q1 2025."
    },
    {
      question: "Is there a limit to document size or batch processing?",
      answer: "Individual documents are limited to 5MB of text content per upload. For batch processing, enterprise plans support up to 500 documents per batch job. Contact our sales team for custom volume requirements exceeding these limits."
    },
    {
      question: 'How does the "Confidence Score" work?',
      answer: "The Confidence Score (0-100%) represents the AI model's certainty that a detected span is genuine PII. Scores above 90% indicate high certainty and are typically auto-confirmed. Scores below 50% are flagged as potential false positives for human review. The score factors in entity type, surrounding context, and cross-reference validation."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface flex flex-col">
      
      <div className="w-full bg-surface py-16 flex flex-col items-center border-b border-outline-variant/20">
        <div className="max-w-4xl w-full px-8 text-center flex flex-col items-center">
          <h1 className="font-display-doc text-[42px] text-on-surface mb-6">How can we help you today?</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body-doc mb-12">
            Search our knowledge base for guides on PII detection, redaction workflows, and compliance standards.
          </p>
          
          <div className="w-full max-w-3xl relative">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search for help..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl py-5 pl-16 pr-24 font-body-ui text-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
              <span className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded text-xs text-on-surface-variant font-bold">⌘</span>
              <span className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded text-xs text-on-surface-variant font-bold">K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-8 py-16 flex flex-col items-center">
        
        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-24">
          {categories
            .filter(cat => !searchQuery || cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((cat, i) => (
            <div key={i} className="paper-card rounded-xl p-8 flex flex-col gap-4 cursor-pointer hover:border-primary/40 hover:bg-surface-container-lowest/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary-fixed-dim/20 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface mt-2">{cat.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl flex flex-col items-center mb-24">
          <h2 className="font-display-doc text-3xl font-bold text-on-surface mb-2">Frequently Asked Questions</h2>
          <p className="text-on-surface-variant mb-12 font-body-doc">Common operational and legal queries answered by our experts.</p>
          
          <div className="w-full flex flex-col border-t border-outline-variant/30">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-outline-variant/30">
                <button 
                  className="w-full py-6 flex justify-between items-center cursor-pointer hover:bg-surface-container-lowest/30 transition-colors px-4 rounded-lg text-left"
                  onClick={() => toggleFaq(i)}
                >
                  <span className="font-body-ui text-on-surface font-medium pr-4">{faq.question}</span>
                  <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-4 pb-6 text-on-surface-variant leading-relaxed font-body-doc">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="w-full max-w-4xl bg-surface-container-low rounded-2xl p-12 flex items-center justify-between border border-outline-variant/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="max-w-xl relative z-10">
            <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3">Still need help?</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Our dedicated legal operations support team is available 24/7 to assist with urgent redaction needs, technical setup, or complex compliance workflows.
            </p>
          </div>
          <button className="bg-primary text-on-primary font-bold px-8 py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md relative z-10 flex items-center gap-2">
            Contact Support
          </button>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-center mt-24 pb-8 border-t border-outline-variant/20 pt-8 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="font-display-doc text-lg text-primary italic font-bold">Conseal</span>
            <span>© 2024 Conseal Legal Suites. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}

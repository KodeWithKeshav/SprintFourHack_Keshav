export default function DirectoryView() {
  const documents = [
    {
      name: "Standard_Services_Agreement_v4.pdf",
      caseId: "#CON-9023-F",
      date: "Oct 24, 2023",
      status: "COMPLETE",
      statusColor: "bg-surface-container/50 text-secondary border-outline-variant",
      itemsDone: 42,
      itemsTotal: 42,
      barColor: "bg-secondary",
      icon: "description"
    },
    {
      name: "Deposition_Transcript_Jones.docx",
      caseId: "#LIT-1124-B",
      date: "Oct 26, 2023",
      status: "IN REVIEW",
      statusColor: "bg-primary-fixed-dim/20 text-on-primary-fixed-variant border-primary-fixed-dim",
      itemsDone: 18,
      itemsTotal: 24,
      barColor: "bg-primary",
      icon: "draft"
    },
    {
      name: "Exhibit_A_Tax_Records_Redacted.pdf",
      caseId: "#AUD-4420-X",
      date: "Oct 27, 2023",
      status: "NEEDS ATTENTION",
      statusColor: "bg-error-container text-on-error-container border-error/50",
      itemsDone: 5,
      itemsTotal: 82,
      barColor: "bg-error",
      icon: "warning"
    },
    {
      name: "Privacy_Notice_Internal_2024.pdf",
      caseId: "#HR-7721-P",
      date: "Oct 22, 2023",
      status: "COMPLETE",
      statusColor: "bg-surface-container/50 text-secondary border-outline-variant",
      itemsDone: 114,
      itemsTotal: 114,
      barColor: "bg-secondary",
      icon: "description"
    },
    {
      name: "M&A_Contract_Final_Draft_Clean.docx",
      caseId: "#CORP-0023-M",
      date: "Oct 28, 2023",
      status: "IN REVIEW",
      statusColor: "bg-primary-fixed-dim/20 text-on-primary-fixed-variant border-primary-fixed-dim",
      itemsDone: 0,
      itemsTotal: 12,
      barColor: "bg-primary",
      icon: "receipt_long"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-surface flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        {/* Filters and Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-6">
            <span className="font-headline-md font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span> Filter By:
            </span>
            <select className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none">
              <option>All Statuses</option>
            </select>
            <select className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none">
              <option>Last 30 Days</option>
            </select>
            <button className="text-sm font-bold text-secondary hover:text-primary transition-colors">Clear All</button>
          </div>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium">
            <span>Showing 24 of 1,402 Documents</span>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
              <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="paper-card rounded-xl overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low border-b border-outline-variant/30 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            <div className="col-span-5">Document Name</div>
            <div className="col-span-2">Process Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="flex flex-col divide-y divide-outline-variant/20">
            {documents.map((doc, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-surface-container-lowest/50 transition-colors">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">{doc.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">{doc.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Case ID: {doc.caseId}</p>
                  </div>
                </div>
                
                <div className="col-span-2 text-sm text-on-surface-variant">
                  {doc.date}
                </div>

                <div className="col-span-2">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="col-span-2 flex flex-col gap-1 pr-8">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>{doc.itemsDone}</span>
                    <span className="text-on-surface-variant">/ {doc.itemsTotal}</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${doc.barColor}`} style={{ width: `${(doc.itemsDone / doc.itemsTotal) * 100}%` }}></div>
                  </div>
                </div>

                <div className="col-span-1 flex justify-end">
                  <button className="text-secondary hover:text-primary transition-colors p-2">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 py-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select className="bg-transparent font-bold text-on-surface focus:outline-none">
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>1-10 of 1,402</span>
              <div className="flex gap-1 text-on-surface">
                <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">first_page</span></button>
                <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
                <button className="p-1 hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">last_page</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Dashboard */}
        <div className="grid grid-cols-4 gap-6 mt-4">
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-center gap-2 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <div className="font-headline-lg text-3xl font-bold text-on-surface mt-2">12.4k</div>
            <div className="text-xs text-on-surface-variant font-medium">Confirmed Redactions</div>
          </div>
          
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-center gap-2 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">insights</span>
            </div>
            <div className="font-headline-lg text-3xl font-bold text-on-surface mt-2">98.2%</div>
            <div className="text-xs text-on-surface-variant font-medium">AI Accuracy Score</div>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex flex-col justify-center gap-2 relative overflow-hidden">
             <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary-fixed-dim/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
            </div>
            <div className="font-headline-lg text-3xl font-bold text-on-surface mt-2">1.4m</div>
            <div className="text-xs text-on-surface-variant font-medium">Time Saved (Hrs)</div>
          </div>

          <div className="bg-primary text-on-primary rounded-xl p-6 flex flex-col justify-center gap-2 cursor-pointer hover:bg-primary-container transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-white/10 pointer-events-none transform group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[100px]">download</span>
            </div>
            <div className="font-headline-md text-xl font-bold mt-2 relative z-10">Generate Audit</div>
            <div className="text-xs font-medium text-primary-fixed relative z-10">Compliance Export</div>
            <span className="material-symbols-outlined absolute top-6 right-6 text-primary-fixed group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </div>
    </div>
  );
}

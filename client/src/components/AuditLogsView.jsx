export default function AuditLogsView() {
  const logs = [
    {
      timestamp: "Oct 24,\n14:22:10",
      document: "NDA_Final_v2.pdf",
      actionTitle: "Phone Number flagged",
      actionDetail: "(+1) 555-0199",
      decision: "CONFIRMED REDACTED",
      decisionColor: "bg-surface-container/50 text-secondary border-outline-variant",
      actor: "Reviewer 04",
      confidence: "98%",
      confidenceColor: "text-secondary border-secondary/30",
    },
    {
      timestamp: "Oct 24,\n14:19:45",
      document: "NDA_Final_v2.pdf",
      actionTitle: "Email address detected",
      actionDetail: "legal@conseal.ai",
      decision: "CONFIRMED SAFE",
      decisionColor: "bg-surface-container/50 text-secondary border-outline-variant",
      actor: "Reviewer 04",
      confidence: "92%",
      confidenceColor: "text-secondary border-secondary/30",
    },
    {
      timestamp: "Oct 24,\n13:55:02",
      document: "Loan_Agreement_A.pdf",
      actionTitle: "SSN detected",
      actionDetail: "XXX-XX-4412",
      decision: "FALSE POSITIVE",
      decisionColor: "bg-surface-container/50 text-secondary border-outline-variant",
      actor: "Reviewer 02",
      confidence: "45%",
      confidenceColor: "text-on-surface-variant border-outline-variant/50",
    },
    {
      timestamp: "Oct 24,\n13:40:11",
      document: "Compliance_v1.doc",
      actionTitle: "Home address flagged",
      actionDetail: "123 Willow Lane...",
      decision: "CONFIRMED REDACTED",
      decisionColor: "bg-surface-container/50 text-secondary border-outline-variant",
      actor: "System AI",
      confidence: "99%",
      confidenceColor: "text-secondary border-secondary/30",
    },
    {
      timestamp: "Oct 24,\n12:15:30",
      document: "Employment_Contract.pdf",
      actionTitle: "Passport Number detected",
      actionDetail: "G1129930",
      decision: "CONFIRMED REDACTED",
      decisionColor: "bg-surface-container/50 text-secondary border-outline-variant",
      actor: "Reviewer 04",
      confidence: "87%",
      confidenceColor: "text-secondary border-secondary/30",
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-surface flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Audit Logs</h1>
          <p className="text-on-surface-variant font-body-doc italic text-lg">
            Every decision, recorded and reviewable.
          </p>
        </div>

        {/* Filters */}
        <div className="paper-card rounded-xl p-6 flex justify-between items-end border-b border-outline-variant/30 bg-surface-container-low shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Document</span>
              <select className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none w-48">
                <option>All Documents</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Action Type</span>
              <select className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none w-40">
                <option>All Actions</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Date Range</span>
              <div className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none w-40 flex items-center justify-between cursor-pointer">
                <span>Last 7 Days</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">User</span>
              <select className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none w-40">
                <option>All Users</option>
              </select>
            </div>
          </div>
          
          <button className="border border-outline-variant/50 text-on-surface font-bold px-6 py-2.5 rounded-md hover:bg-surface-container-high transition-all flex items-center gap-2 h-[42px]">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="paper-card rounded-xl overflow-hidden flex flex-col mt-4">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-surface-container-low border-b border-outline-variant/30 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-3">Document Name</div>
            <div className="col-span-3">Action</div>
            <div className="col-span-2">Decision</div>
            <div className="col-span-1">Actor</div>
            <div className="col-span-1 text-right">Confidence</div>
          </div>

          <div className="flex flex-col divide-y divide-outline-variant/20">
            {logs.map((log, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-surface-container-lowest/50 transition-colors">
                
                <div className="col-span-2 text-sm text-on-surface-variant whitespace-pre-line leading-snug">
                  {log.timestamp}
                </div>
                
                <div className="col-span-3 font-headline-md text-base font-bold text-on-surface pr-4">
                  {log.document}
                </div>

                <div className="col-span-3 flex flex-col gap-1 pr-4">
                  <span className="text-sm font-medium text-on-surface">{log.actionTitle}</span>
                  <span className="text-xs text-on-surface-variant font-mono bg-surface-container-low px-2 py-0.5 rounded w-fit">{log.actionDetail}</span>
                </div>

                <div className="col-span-2">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm border ${log.decisionColor}`}>
                    {log.decision}
                  </span>
                </div>

                <div className="col-span-1 text-sm text-on-surface-variant">
                  {log.actor}
                </div>

                <div className="col-span-1 flex justify-end">
                  <div className={`w-12 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${log.confidenceColor} bg-surface`}>
                    {log.confidence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-on-surface-variant mt-2 px-2">
          <span>Showing 1 to 5 of 1,248 entries</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded bg-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary rounded font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded bg-surface hover:bg-surface-container transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded bg-surface hover:bg-surface-container transition-colors">3</button>
            <span className="w-8 h-8 flex items-center justify-center">...</span>
            <button className="w-10 h-8 flex items-center justify-center border border-outline-variant/50 rounded bg-surface hover:bg-surface-container transition-colors">250</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded bg-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
          </div>
        </div>

      </div>
    </div>
  );
}

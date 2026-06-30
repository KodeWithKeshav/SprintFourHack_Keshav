export default function ExposureMeter({ highRiskCount, totalPending, allClear }) {
  if (allClear) {
    return (
      <div className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full flex items-center gap-sm">
        <span className="material-symbols-outlined text-[18px]">verified_user</span>
        <span className="font-label-caps text-label-caps">All Clear</span>
      </div>
    );
  }

  if (highRiskCount > 0) {
    return (
      <div className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full flex items-center gap-sm">
        <span className="material-symbols-outlined text-[18px]">warning</span>
        <span className="font-label-caps text-label-caps">
          {highRiskCount} item{highRiskCount !== 1 ? 's' : ''} needing confirmation
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-high text-on-surface-variant px-4 py-1.5 rounded-full flex items-center gap-sm">
      <span className="material-symbols-outlined text-[18px]">pending_actions</span>
      <span className="font-label-caps text-label-caps">
        {totalPending} item{totalPending !== 1 ? 's' : ''} remaining
      </span>
    </div>
  );
}

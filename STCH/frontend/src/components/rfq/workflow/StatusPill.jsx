const STATUS_STYLES = {
  NOT_STARTED: "bg-zinc-700/50 text-zinc-400 border-zinc-600/40",
  IN_PROGRESS:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  COMPLETED:    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  APPROVED:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  SUBMITTED:    "bg-violet-500/20 text-violet-400 border-violet-500/30",
  UNDER_REVIEW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  REJECTED:     "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS = {
  NOT_STARTED:  "Not Started",
  IN_PROGRESS:  "In Progress",
  COMPLETED:    "Completed",
  APPROVED:     "Approved",
  SUBMITTED:    "Submitted",
  UNDER_REVIEW: "Under Review",
  REJECTED:     "Rejected",
};

export default function StatusPill({ status, size = "sm" }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.NOT_STARTED;
  const label = STATUS_LABELS[status] || status;
  const textSize = size === "xs" ? "text-xs" : "text-xs";
  const padding  = size === "xs" ? "px-2 py-0.5" : "px-3 py-1";

  return (
    <span className={`inline-flex items-center ${padding} rounded-full border font-medium ${textSize} ${style} whitespace-nowrap`}>
      {label}
    </span>
  );
}

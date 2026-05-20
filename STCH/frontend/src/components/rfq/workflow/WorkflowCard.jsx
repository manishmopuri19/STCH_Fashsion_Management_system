import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";
import StatusPill from "./StatusPill";

const PROGRESS = {
  NOT_STARTED:  0,
  IN_PROGRESS:  45,
  COMPLETED:    85,
  APPROVED:     100,
};

const ICON_BG = {
  NOT_STARTED:  "bg-zinc-700/50 text-zinc-500",
  IN_PROGRESS:  "bg-blue-500/15 text-blue-400",
  COMPLETED:    "bg-emerald-500/15 text-emerald-400",
  APPROVED:     "bg-orange-500/15 text-orange-400",
};

const BAR_COLOR = {
  NOT_STARTED:  "bg-zinc-600",
  IN_PROGRESS:  "bg-blue-500",
  COMPLETED:    "bg-emerald-500",
  APPROVED:     "bg-gradient-to-r from-orange-500 to-orange-400",
};

export default function WorkflowCard({ icon: Icon, title, description, status, route, actionLabel = "Open" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const progress = PROGRESS[status] ?? 0;
  const barColor = BAR_COLOR[status] ?? BAR_COLOR.NOT_STARTED;
  const iconBg = ICON_BG[status] ?? ICON_BG.NOT_STARTED;

  return (
    <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-5 hover:border-[#3A4257] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${iconBg}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{title}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-zinc-500">Progress</span>
          <span className="text-xs text-zinc-400 font-medium">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1D2230] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/rfqs/${id}/${route}`)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-zinc-300 hover:bg-[#283041] hover:text-white hover:border-orange-500/40 transition-all duration-200 group-hover:border-[#3A4257]"
      >
        {actionLabel}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

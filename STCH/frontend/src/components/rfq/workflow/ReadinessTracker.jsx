import { CheckCircle2, Circle, Lock, Unlock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const GATE_ITEMS = [
  { key: "mini_marker", label: "Mini Marker",  route: "mini-marker" },
  { key: "bom",         label: "BOM",          route: "bom" },
  { key: "style_sheet", label: "Style Sheet",  route: "style-sheet" },
  { key: "sampling",    label: "PP Sampling",  route: "sampling" },
];

export default function ReadinessTracker({ readiness, onConvertToPO, canConvert }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const poAllowed = readiness?.po_allowed ?? false;
  const completed = GATE_ITEMS.filter(g => readiness?.[g.key]?.ready).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Production Readiness</p>
          <p className="text-xs text-zinc-500 mt-0.5">{completed} of {GATE_ITEMS.length} gates cleared</p>
        </div>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${poAllowed ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700/50 text-zinc-500"}`}>
          {poAllowed ? <Unlock size={16} /> : <Lock size={16} />}
        </div>
      </div>

      <div className="w-full h-1.5 bg-[#1D2230] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-700"
          style={{ width: `${(completed / GATE_ITEMS.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {GATE_ITEMS.map((gate) => {
          const ready = readiness?.[gate.key]?.ready;
          const status = readiness?.[gate.key]?.status ?? "NOT_STARTED";
          return (
            <button
              key={gate.key}
              onClick={() => navigate(`/rfqs/${id}/${gate.route}`)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F141D] border border-[#2A3142] hover:border-[#3A4257] transition-all group text-left"
            >
              {ready ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={16} className="text-zinc-600 shrink-0" />
              )}
              <span className={`text-sm font-medium flex-1 ${ready ? "text-emerald-400" : "text-zinc-400"}`}>
                {gate.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ready ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-700/40 text-zinc-500 border-zinc-600/30"}`}>
                {ready ? "Ready" : status.replace("_", " ")}
              </span>
            </button>
          );
        })}
      </div>

      {canConvert && (
        <button
          onClick={onConvertToPO}
          disabled={!poAllowed}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
            poAllowed
              ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-500 hover:to-violet-400 shadow-lg shadow-violet-500/20"
              : "bg-[#1D2230] text-zinc-600 border border-[#2A3142] cursor-not-allowed"
          }`}
        >
          {poAllowed ? "Convert to Purchase Order" : "Complete All Gates to Unlock PO"}
        </button>
      )}
    </div>
  );
}

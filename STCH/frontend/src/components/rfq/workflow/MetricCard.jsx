export default function MetricCard({ label, value, unit = "", accent = false, sublabel }) {
  return (
    <div className={`bg-[#0F141D] border rounded-2xl p-5 ${accent ? "border-orange-500/30" : "border-[#2A3142]"}`}>
      <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-1.5">
        <span className={`text-2xl font-bold ${accent ? "text-orange-400" : "text-white"}`}>
          {value ?? "—"}
        </span>
        {unit && <span className="text-sm text-zinc-500 mb-0.5">{unit}</span>}
      </div>
      {sublabel && <p className="text-xs text-zinc-600 mt-1">{sublabel}</p>}
    </div>
  );
}

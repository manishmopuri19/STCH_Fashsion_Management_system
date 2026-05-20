import { Upload, FileCheck, X } from "lucide-react";

export default function UploadZone({ label, value, onChange, accept = "*", hint }) {
  const hasFile = Boolean(value);

  return (
    <div>
      {label && <p className="text-sm text-zinc-400 mb-2">{label}</p>}

      {hasFile ? (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0F141D] border border-emerald-500/30 rounded-xl">
          <FileCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="text-sm text-emerald-400 flex-1 truncate">{value}</span>
          <button onClick={() => onChange("")} className="text-zinc-500 hover:text-zinc-300">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center gap-2 px-4 py-6 bg-[#0F141D] border-2 border-dashed border-[#2A3142] rounded-xl cursor-pointer hover:border-orange-500/40 hover:bg-[#111620] transition-all">
          <Upload size={20} className="text-zinc-500" />
          <span className="text-sm text-zinc-500">
            Paste URL or click to reference file
          </span>
          {hint && <span className="text-xs text-zinc-600">{hint}</span>}
          <input
            type="text"
            placeholder="Paste file URL..."
            className="mt-2 w-full px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-white outline-none focus:border-orange-500/50 placeholder:text-zinc-600"
            onChange={(e) => onChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </label>
      )}
    </div>
  );
}

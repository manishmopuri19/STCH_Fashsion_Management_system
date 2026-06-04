import { useState, useRef } from "react";
import { Link, Upload, X, Loader2 } from "lucide-react";
import API from "../../../api/axios";

export function FormField({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-zinc-400">{label}</label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}

// ─── Text / Number / Date input ───────────────────────────────────────────────
export function RFQInput({
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  className = "",
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full bg-[#0F141D] border border-[#2A3142] rounded-xl
        px-4 py-2.5 text-sm text-white placeholder-zinc-600
        focus:outline-none focus:border-orange-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${className}
      `}
    />
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function RFQTextArea({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  className = "",
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full bg-[#0F141D] border border-[#2A3142] rounded-xl
        px-4 py-2.5 text-sm text-white placeholder-zinc-600
        focus:outline-none focus:border-orange-500
        resize-y transition-colors duration-150
        ${className}
      `}
    />
  );
}

// ─── Select dropdown ──────────────────────────────────────────────────────────
export function RFQSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select…",
  className = "",
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full bg-[#0F141D] border border-[#2A3142] rounded-xl
        px-4 py-2.5 text-sm text-white appearance-none
        focus:outline-none focus:border-orange-500
        transition-colors duration-150 cursor-pointer
        ${!value ? "text-zinc-600" : "text-white"}
        ${className}
      `}
    >
      <option value="" disabled className="text-zinc-600">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-white bg-[#1A1F2E]">
          {opt}
        </option>
      ))}
    </select>
  );
}

// ─── Dual file-or-URL input ───────────────────────────────────────────────────
export function FileOrUrlInput({
  value,
  onChange,
  placeholder = "https://…",
  accept = "*",
  uploadPath = "/rfqs/upload-attachment",
}) {
  const [mode, setMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await API.post(uploadPath, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(res.data.url);
      setUploadedName(res.data.filename || file.name);
    } catch (err) {
      setUploadError(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    onChange("");
    setUploadedName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-[#0F141D] border border-[#2A3142] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => { setMode("url"); clearFile(); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "url" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Link size={12} /> URL
        </button>
        <button
          type="button"
          onClick={() => { setMode("file"); onChange(""); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "file" ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Upload size={12} /> Upload File
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      ) : (
        <div className="w-full">
          {uploadedName ? (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-400 text-sm font-medium flex-1 truncate">{uploadedName}</span>
              <button type="button" onClick={clearFile} className="text-zinc-500 hover:text-red-400 transition-all">
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-[#2A3142] cursor-pointer hover:border-orange-500/40 hover:bg-[#1A1F2E] transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {uploading ? (
                <Loader2 size={14} className="text-orange-400 animate-spin" />
              ) : (
                <Upload size={14} className="text-zinc-500" />
              )}
              <span className="text-sm text-zinc-400">{uploading ? "Uploading…" : "Choose file"}</span>
              <input
                ref={fileRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
          )}
          {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Toggle chip (multi-select pill) ─────────────────────────────────────────
export function ChipGroup({ options, selected = [], onToggle, variant = "solid" }) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        const solidActive   = "bg-orange-500 border-orange-500 text-white";
        const outlineActive = "bg-orange-500/10 border-orange-500 text-orange-400";
        const inactive      = "bg-[#0F141D] border-[#2A3142] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200";

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`
              px-4 py-2 rounded-xl border text-sm font-medium
              transition-all duration-150
              ${active ? (variant === "outline" ? outlineActive : solidActive) : inactive}
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

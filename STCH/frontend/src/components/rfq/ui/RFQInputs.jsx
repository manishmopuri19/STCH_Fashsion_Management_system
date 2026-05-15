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
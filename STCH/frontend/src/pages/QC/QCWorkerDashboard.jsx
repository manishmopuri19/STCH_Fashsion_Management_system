import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Package,
  X,
  ChevronRight,
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const INSPECTION_TYPE_COLOR = {
  INLINE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  MIDLINE: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  FINAL: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  PRE_SHIPMENT: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const RESULT_CONFIG = {
  PENDING: { label: "Pending", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" },
  PASSED: { label: "Passed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  FAILED: { label: "Failed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  CONDITIONAL_PASS: { label: "Conditional", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  REJECTED: { label: "Rejected", color: "text-red-500", bg: "bg-red-600/10 border-red-600/20" },
};

function QCWorkerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("work");
  const [workList, setWorkList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState(null);

  const initials = user?.userName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "QC";

  const fetchWork = () =>
    API.get("/qc/my-work").then((r) => setWorkList(r.data));
  const fetchHistory = () =>
    API.get("/qc/my-history").then((r) => setHistoryList(r.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWork(), fetchHistory()]).finally(() => setLoading(false));
  }, []);

  const handleSubmitted = () => {
    setSelectedInspection(null);
    Promise.all([fetchWork(), fetchHistory()]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto space-y-8 pb-16">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-[36px] border border-[#2A3142] bg-[#151821] p-8">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Quality Control
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {user?.userName}
              </h1>
              <p className="text-zinc-500 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <StatCard label="Assigned Work" value={workList.length} color="text-orange-400" />
            <StatCard label="Completed" value={historyList.length} color="text-emerald-400" />
            <StatCard
              label="Pending"
              value={workList.filter((w) => w.status === "PENDING").length}
              color="text-yellow-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[#151821] border border-[#2A3142] rounded-2xl w-fit">
          <TabButton
            active={activeTab === "work"}
            onClick={() => setActiveTab("work")}
            count={workList.length}
          >
            <ClipboardList size={14} /> Assigned Work
          </TabButton>
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            count={historyList.length}
          >
            <CheckCircle2 size={14} /> History
          </TabButton>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="text-orange-500 animate-spin" size={32} />
          </div>
        ) : activeTab === "work" ? (
          <WorkList
            items={workList}
            onOpen={(item) => setSelectedInspection(item)}
          />
        ) : (
          <HistoryList items={historyList} />
        )}
      </div>

      {selectedInspection && (
        <InspectionSubmitModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </DashboardLayout>
  );
}

/* ── Work list ─────────────────────────────────────────── */

function WorkList({ items, onOpen }) {
  if (items.length === 0) {
    return (
      <EmptyPane
        icon={<ClipboardList size={40} className="text-zinc-700" />}
        message="No inspections assigned to you yet."
        sub="Your manager will assign PO inspections here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WorkCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}

function WorkCard({ item, onOpen }) {
  const typeClass =
    INSPECTION_TYPE_COLOR[item.inspection_type] ||
    "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

  return (
    <div className="rounded-[20px] border border-[#2A3142] bg-[#151821] p-6 hover:border-emerald-500/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Left */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${typeClass}`}
            >
              {item.inspection_type?.replaceAll("_", " ")}
            </span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
              {item.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Package size={14} className="text-orange-400 flex-shrink-0" />
            <span className="text-white font-bold">
              {item.po?.po_number || "—"}
            </span>
            {item.po?.supplier_name && (
              <span className="text-zinc-500 text-sm">
                · {item.po.supplier_name}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            {item.po?.quantity && (
              <span>Qty: {item.po.quantity.toLocaleString()} pcs</span>
            )}
            {item.po?.delivery_date && (
              <span>Delivery: {item.po.delivery_date}</span>
            )}
            {item.defect_count > 0 && (
              <span className="text-red-400">{item.defect_count} defect{item.defect_count !== 1 ? "s" : ""} logged</span>
            )}
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onOpen(item)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-all flex-shrink-0"
        >
          {item.status === "PENDING" ? "Start Inspection" : "Update"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── History list ──────────────────────────────────────── */

function HistoryList({ items }) {
  if (items.length === 0) {
    return (
      <EmptyPane
        icon={<CheckCircle2 size={40} className="text-zinc-700" />}
        message="No completed inspections yet."
        sub="Submitted inspections will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function HistoryCard({ item }) {
  const typeClass =
    INSPECTION_TYPE_COLOR[item.inspection_type] ||
    "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  const resultCfg = RESULT_CONFIG[item.result] || RESULT_CONFIG.PENDING;

  return (
    <div className="rounded-[20px] border border-[#2A3142] bg-[#151821] p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${typeClass}`}
            >
              {item.inspection_type?.replaceAll("_", " ")}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${resultCfg.bg} ${resultCfg.color}`}
            >
              {resultCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Package size={14} className="text-orange-400 flex-shrink-0" />
            <span className="text-white font-bold">
              {item.po?.po_number || "—"}
            </span>
            {item.po?.supplier_name && (
              <span className="text-zinc-500 text-sm">
                · {item.po.supplier_name}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            {item.total_checked != null && (
              <span>Checked: {item.total_checked}</span>
            )}
            {item.passed_quantity != null && (
              <span className="text-emerald-400">
                Passed: {item.passed_quantity}
              </span>
            )}
            {item.failed_quantity != null && item.failed_quantity > 0 && (
              <span className="text-red-400">
                Failed: {item.failed_quantity}
              </span>
            )}
            {item.inspection_date && (
              <span>Date: {item.inspection_date}</span>
            )}
          </div>

          {item.remarks && (
            <p className="text-zinc-500 text-xs mt-1 italic">
              "{item.remarks}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Submit Modal ──────────────────────────────────────── */

const RESULT_OPTIONS = [
  { value: "PASSED", label: "Passed" },
  { value: "FAILED", label: "Failed" },
  { value: "CONDITIONAL_PASS", label: "Conditional Pass" },
  { value: "REJECTED", label: "Rejected" },
];

function InspectionSubmitModal({ inspection, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    inspection_date: inspection.inspection_date || "",
    aql_level: inspection.aql_level || "",
    total_checked: inspection.total_checked ?? "",
    passed_quantity: inspection.passed_quantity ?? "",
    failed_quantity: inspection.failed_quantity ?? "",
    result: inspection.result !== "PENDING" ? inspection.result : "",
    remarks: inspection.remarks || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleTotalChange = (v) => {
    set("total_checked", v);
    const total = parseInt(v, 10);
    const passed = parseInt(form.passed_quantity, 10);
    if (!isNaN(total) && !isNaN(passed)) {
      set("failed_quantity", String(Math.max(0, total - passed)));
    }
  };

  const handlePassedChange = (v) => {
    set("passed_quantity", v);
    const total = parseInt(form.total_checked, 10);
    const passed = parseInt(v, 10);
    if (!isNaN(total) && !isNaN(passed)) {
      set("failed_quantity", String(Math.max(0, total - passed)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.result) { setError("Please select a result."); return; }
    setSubmitting(true);
    setError("");
    try {
      await API.patch(`/qc/${inspection.id}/submit`, {
        inspection_date: form.inspection_date,
        aql_level: form.aql_level,
        total_checked: parseInt(form.total_checked, 10),
        passed_quantity: parseInt(form.passed_quantity, 10),
        failed_quantity: parseInt(form.failed_quantity, 10),
        result: form.result,
        remarks: form.remarks || null,
      });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit inspection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#151821] border border-[#2A3142] rounded-[28px] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#2A3142]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Inspection Report
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              {inspection.po?.po_number || "PO"} —{" "}
              {inspection.inspection_type?.replaceAll("_", " ")}
            </h2>
            {inspection.po?.supplier_name && (
              <p className="text-zinc-500 text-sm mt-0.5">
                {inspection.po.supplier_name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5 max-h-[70vh] overflow-y-auto">

          <div className="grid grid-cols-2 gap-4">
            <Field label="Inspection Date" required>
              <input
                type="date"
                required
                value={form.inspection_date}
                onChange={(e) => set("inspection_date", e.target.value)}
                className="input-dark"
              />
            </Field>
            <Field label="AQL Level" required>
              <input
                type="text"
                required
                placeholder="e.g. 2.5"
                value={form.aql_level}
                onChange={(e) => set("aql_level", e.target.value)}
                className="input-dark"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Total Checked" required>
              <input
                type="number"
                required
                min="0"
                value={form.total_checked}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="input-dark"
              />
            </Field>
            <Field label="Passed">
              <input
                type="number"
                min="0"
                value={form.passed_quantity}
                onChange={(e) => handlePassedChange(e.target.value)}
                className="input-dark"
              />
            </Field>
            <Field label="Failed">
              <input
                type="number"
                min="0"
                value={form.failed_quantity}
                onChange={(e) => set("failed_quantity", e.target.value)}
                className="input-dark"
              />
            </Field>
          </div>

          <Field label="Result" required>
            <div className="grid grid-cols-2 gap-2">
              {RESULT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("result", opt.value)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    form.result === opt.value
                      ? opt.value === "PASSED" || opt.value === "CONDITIONAL_PASS"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-red-500/20 border-red-500/50 text-red-400"
                      : "bg-[#1D2230] border-[#2A3142] text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Remarks">
            <textarea
              rows={3}
              placeholder="Any notes or observations…"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
              className="input-dark resize-none"
            />
          </Field>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-[#2A3142] text-zinc-400 font-semibold text-sm hover:text-white hover:border-zinc-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Submit Inspection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Shared helpers ────────────────────────────────────── */

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
      <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold block mb-1">
        {label}
      </span>
      <span className={`font-black text-3xl ${color}`}>{value}</span>
    </div>
  );
}

function TabButton({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active ? "bg-orange-500 text-white shadow-md" : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
          active ? "bg-white/20" : "bg-[#2A3142]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyPane({ icon, message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#2A3142] rounded-[22px] text-center space-y-3">
      {icon}
      <p className="text-zinc-400 font-semibold text-base">{message}</p>
      {sub && <p className="text-zinc-600 text-sm">{sub}</p>}
    </div>
  );
}

export default QCWorkerDashboard;

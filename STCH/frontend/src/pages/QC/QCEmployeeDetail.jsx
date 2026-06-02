import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  ArrowLeft, ShieldCheck, Mail, ClipboardList, CheckCircle2,
  AlertTriangle, Activity, Clock, Package, FileText,
  MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";

const STATUS_STYLES = {
  PENDING:     "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  IN_PROGRESS: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  COMPLETED:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DELAYED:     "text-red-400 bg-red-500/10 border-red-500/20",
  HOLD:        "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CANCELLED:   "text-zinc-600 bg-zinc-700/10 border-zinc-700/20",
};

const PRIORITY_STYLES = {
  LOW:      "text-zinc-400 bg-zinc-500/10",
  MEDIUM:   "text-blue-400 bg-blue-500/10",
  HIGH:     "text-orange-400 bg-orange-500/10",
  CRITICAL: "text-red-400 bg-red-500/10",
};

const QC_ACTIVITY_TYPES = new Set([
  "INLINE_INSPECTION", "MIDLINE_INSPECTION", "FINAL_INSPECTION",
  "METAL_DETECTION", "QA_APPROVAL",
]);

export default function QCEmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tnas"); // tnas | rfqs | pos
  const [expandedPos, setExpandedPos] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    API.get(`/qc/employees/${id}`)
      .then((r) => {
        setData(r.data);
        // Expand all PO groups by default
        const groups = {};
        const poIds = [...new Set(r.data.tnas.map((t) => t.po_id))];
        poIds.forEach((pid) => { groups[pid] = true; });
        setExpandedPos(groups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 text-sm animate-pulse">
          Loading employee details...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-3">
          <ShieldCheck size={44} className="opacity-20" />
          <p className="text-sm">Employee not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { user, stats, tnas, rfqs, purchase_orders } = data;

  // Group TNAs by PO
  const tnasByPo = {};
  tnas.forEach((t) => {
    const key = t.po_id;
    if (!tnasByPo[key]) tnasByPo[key] = { po_number: t.po_number, tasks: [] };
    tnasByPo[key].tasks.push(t);
  });

  const togglePo = (poId) =>
    setExpandedPos((prev) => ({ ...prev, [poId]: !prev[poId] }));

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8">

        {/* Back */}
        <button
          onClick={() => navigate("/qc")}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to QC Team
        </button>

        {/* Employee Header */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg shadow-teal-500/20">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">{user.userName}</h1>
                <span className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Mail size={13} className="text-zinc-600" />
                <p className="text-zinc-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            {[
              { label: "Total Tasks",  value: stats.total_tnas,  color: "text-white",         bg: "bg-blue-500/10" },
              { label: "Pending",      value: stats.pending,     color: "text-zinc-400",       bg: "bg-zinc-500/10" },
              { label: "In Progress",  value: stats.in_progress, color: "text-orange-400",     bg: "bg-orange-500/10" },
              { label: "Completed",    value: stats.completed,   color: "text-emerald-400",    bg: "bg-emerald-500/10" },
              { label: "Overdue",      value: stats.overdue,     color: stats.overdue > 0 ? "text-red-400" : "text-zinc-500", bg: stats.overdue > 0 ? "bg-red-500/10" : "bg-zinc-500/10" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#2A3142] pb-0">
          {[
            { key: "tnas", label: "Assigned Tasks", count: stats.total_tnas, icon: <ClipboardList size={14} /> },
            { key: "rfqs", label: "Collaborated RFQs", count: rfqs.length, icon: <FileText size={14} /> },
            { key: "pos",  label: "Purchase Orders",  count: purchase_orders.length, icon: <Package size={14} /> },
          ].map(({ key, label, count, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all -mb-px ${
                activeTab === key
                  ? "border-teal-500 text-teal-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {icon}
              {label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                activeTab === key ? "bg-teal-500/20 text-teal-400" : "bg-[#2A3142] text-zinc-500"
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "tnas" && (
          <div className="space-y-5">
            {Object.keys(tnasByPo).length === 0 ? (
              <EmptyState message="No tasks assigned to this employee." />
            ) : (
              Object.entries(tnasByPo).map(([poId, group]) => {
                const done = group.tasks.filter((t) => t.status === "COMPLETED").length;
                const pct = group.tasks.length > 0 ? Math.round((done / group.tasks.length) * 100) : 0;
                const expanded = !!expandedPos[poId];

                return (
                  <div key={poId} className="bg-[#151821] border border-[#2A3142] rounded-[24px] overflow-hidden">
                    <button
                      onClick={() => togglePo(poId)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center flex-shrink-0">
                          <Package size={15} className="text-orange-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">
                            {group.po_number ? `PO #${group.po_number}` : `Order #${poId}`}
                          </p>
                          <p className="text-zinc-500 text-xs">{done}/{group.tasks.length} tasks completed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-[#2A3142] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{pct}%</span>
                        </div>
                        {expanded ? <ChevronUp size={15} className="text-zinc-500" /> : <ChevronDown size={15} className="text-zinc-500" />}
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-[#2A3142] divide-y divide-[#2A3142]/50">
                        {group.tasks.map((tna) => (
                          <TNARow key={tna.id} tna={tna} today={today} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "rfqs" && (
          <div className="space-y-3">
            {rfqs.length === 0 ? (
              <EmptyState message="This employee has not been added to any RFQ as a collaborator yet." />
            ) : (
              rfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="bg-[#151821] border border-[#2A3142] rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center flex-shrink-0">
                      <FileText size={15} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">{rfq.rfq_number}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {rfq.brand} · {rfq.season} · {rfq.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {rfq.delivery_date && (
                      <p className="text-zinc-500 text-xs hidden sm:block">
                        Delivery: {rfq.delivery_date}
                      </p>
                    )}
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${STATUS_STYLES[rfq.status] || "text-zinc-400 border-zinc-500/20"}`}>
                      {rfq.status?.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "pos" && (
          <div className="space-y-3">
            {purchase_orders.length === 0 ? (
              <EmptyState message="No purchase orders linked to this employee's tasks yet." />
            ) : (
              purchase_orders.map((po) => (
                <div
                  key={po.id}
                  className="bg-[#151821] border border-[#2A3142] rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center flex-shrink-0">
                      <Package size={15} className="text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">{po.po_number}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Qty: {po.quantity ?? "—"}
                        {po.delivery_date && ` · Delivery: ${po.delivery_date}`}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex-shrink-0 ${STATUS_STYLES[po.status] || "text-zinc-400 border-zinc-500/20"}`}>
                    {po.status?.replaceAll("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── TNA Row (read-only, admin view) ────────────────────────────────────────

function TNARow({ tna, today }) {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const isQcTask = QC_ACTIVITY_TYPES.has(tna.activity_type);
  const isOverdue = tna.planned_date && tna.planned_date < today && tna.status !== "COMPLETED" && tna.status !== "CANCELLED";
  const activityLabel = tna.activity_type === "CUSTOM" && tna.custom_name ? tna.custom_name : tna.activity_type.replaceAll("_", " ");

  return (
    <div className={`px-6 py-4 ${isQcTask ? "bg-teal-500/[0.02]" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {isQcTask && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold">
                QC
              </span>
            )}
            <span className="text-white font-semibold text-sm">{activityLabel}</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${PRIORITY_STYLES[tna.priority] || ""}`}>
              {tna.priority}
            </span>
          </div>
          {tna.style && (
            <p className="text-xs text-zinc-500">
              <span className="text-orange-400 font-mono font-semibold">{tna.style.style_code}</span>
              {tna.style.style_name && <span className="ml-1.5">{tna.style.style_name}</span>}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className={isOverdue ? "text-red-400 font-semibold" : "text-zinc-500"}>
              {isOverdue ? "Overdue · " : "Due "}{tna.planned_date || "—"}
            </span>
            {tna.actual_date && <span className="text-emerald-400">Done {tna.actual_date}</span>}
          </div>
          {tna.status === "DELAYED" && tna.delayed_reason && (
            <p className="text-xs text-red-400 italic">Reason: {tna.delayed_reason}</p>
          )}
        </div>

        {/* Status badge */}
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-xl border text-xs font-bold ${STATUS_STYLES[tna.status] || ""}`}>
          {tna.status?.replaceAll("_", " ")}
        </span>
      </div>

      {/* Remarks (read-only toggle) */}
      {tna.remarks && (
        <div className="mt-2.5">
          <button
            onClick={() => setRemarksOpen(!remarksOpen)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-all"
          >
            <MessageSquare size={11} className="text-teal-500" />
            <span>{remarksOpen ? "Hide remarks" : "View remarks"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          </button>
          {remarksOpen && (
            <div className="mt-2 px-3 py-2.5 bg-[#0F141D] border border-[#2A3142] rounded-xl text-xs text-zinc-400 leading-relaxed">
              {tna.remarks}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-zinc-600 space-y-2">
      <ShieldCheck size={36} className="opacity-20" />
      <p className="text-sm text-center max-w-xs">{message}</p>
    </div>
  );
}

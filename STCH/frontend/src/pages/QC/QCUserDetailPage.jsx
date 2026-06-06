import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const TNA_STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20", icon: Clock },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Clock },
  COMPLETED: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  DELAYED: { label: "Delayed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
  HOLD: { label: "On Hold", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: AlertCircle },
  CANCELLED: { label: "Cancelled", color: "text-zinc-600", bg: "bg-zinc-700/10 border-zinc-700/20", icon: XCircle },
};

const RFQ_STATUS_CONFIG = {
  NEW: { label: "New", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  IN_REVIEW: { label: "In Review", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  QUOTED: { label: "Quoted", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  APPROVED: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  REJECTED: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  CLOSED: { label: "Closed", color: "text-zinc-500", bg: "bg-zinc-700/10 border-zinc-700/20" },
};

function QCUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("tnas");

  useEffect(() => {
    API.get(`/users/${userId}/qc-detail`)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load QC user details."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="text-orange-500 animate-spin" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32 text-red-400 text-sm">{error || "No data found."}</div>
      </DashboardLayout>
    );
  }

  const { user, rfqs, tnas } = data;
  const initials = user.userName?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "QC";

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-16">

        {/* Back */}
        <button
          onClick={() => navigate("/qc")}
          className="text-zinc-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
        >
          ← Back to QC Team
        </button>

        {/* User Hero */}
        <div className="relative overflow-hidden rounded-[36px] border border-[#2A3142] bg-[#151821] p-8">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Quality Control</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">{user.userName}</h1>
              <p className="text-zinc-500 mt-1">{user.email}</p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
            <StatCard label="Assigned RFQs" value={rfqs.length} color="text-orange-400" />
            <StatCard label="Assigned TNAs" value={tnas.length} color="text-blue-400" />
            <StatCard
              label="Pending TNAs"
              value={tnas.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS").length}
              color="text-yellow-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[#151821] border border-[#2A3142] rounded-2xl w-fit">
          <TabButton active={activeTab === "tnas"} onClick={() => setActiveTab("tnas")} count={tnas.length}>
            <ClipboardList size={14} /> TNA Assignments
          </TabButton>
          <TabButton active={activeTab === "rfqs"} onClick={() => setActiveTab("rfqs")} count={rfqs.length}>
            <FileText size={14} /> RFQs
          </TabButton>
        </div>

        {/* TNA Tab */}
        {activeTab === "tnas" && (
          <div className="space-y-3">
            {tnas.length === 0 ? (
              <EmptyPane message="No TNA milestones assigned to this user." />
            ) : (
              tnas.map((tna) => <TNARow key={tna.id} tna={tna} navigate={navigate} />)
            )}
          </div>
        )}

        {/* RFQ Tab */}
        {activeTab === "rfqs" && (
          <div className="space-y-3">
            {rfqs.length === 0 ? (
              <EmptyPane message="No RFQs assigned to this user." />
            ) : (
              rfqs.map((rfq) => <RFQRow key={rfq.id} rfq={rfq} navigate={navigate} />)
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function TNARow({ tna, navigate }) {
  const cfg = TNA_STATUS_CONFIG[tna.status] || TNA_STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;

  return (
    <div className="rounded-[18px] border border-[#2A3142] bg-[#151821] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-white font-bold truncate">
          {tna.activity_type?.replaceAll("_", " ")}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          {tna.po_number && (
            <span
              className="text-orange-400 cursor-pointer hover:underline"
              onClick={() => navigate(`/orders/${tna.po_id}`)}
            >
              {tna.po_number}
            </span>
          )}
          {tna.style_name && (
            <span className="text-purple-400">{tna.style_name} ({tna.style_code})</span>
          )}
          {tna.planned_date && <span>Planned: {tna.planned_date}</span>}
          {tna.actual_date && <span>Actual: {tna.actual_date}</span>}
        </div>
        {tna.delayed_reason && (
          <p className="text-red-400 text-xs mt-1">Delay reason: {tna.delayed_reason}</p>
        )}
        {tna.remarks && (
          <p className="text-zinc-500 text-xs mt-1">{tna.remarks}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${cfg.bg} ${cfg.color}`}>
          <StatusIcon size={12} />
          {cfg.label}
        </span>
        {tna.priority && (
          <span className="text-xs text-zinc-500 font-semibold uppercase">{tna.priority}</span>
        )}
      </div>
    </div>
  );
}

function RFQRow({ rfq, navigate }) {
  const cfg = RFQ_STATUS_CONFIG[rfq.status] || { label: rfq.status, color: "text-zinc-400", bg: "bg-zinc-700/10 border-zinc-700/20" };

  return (
    <div
      onClick={() => navigate(`/rfqs/${rfq.id}`)}
      className="group cursor-pointer rounded-[18px] border border-[#2A3142] bg-[#151821] p-5 flex items-center gap-4 hover:border-orange-500/40 hover:bg-[#1A1F2E] transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            {rfq.rfq_number}
          </span>
        </div>
        <p className="text-white font-bold truncate">{rfq.brand} — {rfq.garment_type}</p>
        {rfq.delivery_date && (
          <p className="text-zinc-500 text-xs mt-0.5">Delivery: {rfq.delivery_date}</p>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
        <ArrowRight size={15} className="text-zinc-600 group-hover:text-orange-400 transition-all" />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        active
          ? "bg-orange-500 text-white shadow-md"
          : "text-zinc-400 hover:text-white"
      }`}
    >
      {children}
      <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${active ? "bg-white/20" : "bg-[#2A3142]"}`}>
        {count}
      </span>
    </button>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-4">
      <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold block mb-1">{label}</span>
      <span className={`font-black text-3xl ${color}`}>{value}</span>
    </div>
  );
}

function EmptyPane({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#2A3142] rounded-[22px] text-center">
      <p className="text-zinc-500 text-sm">{message}</p>
    </div>
  );
}

export default QCUserDetailPage;

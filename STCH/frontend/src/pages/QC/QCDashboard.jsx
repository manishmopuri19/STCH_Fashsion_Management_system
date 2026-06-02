import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  ShieldCheck, Clock, CheckCircle2, AlertTriangle, Activity,
  ChevronDown, ChevronUp, Save, ClipboardList, Package,
  MessageSquare, Search, User, Mail, ChevronRight,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const QC_ACTIVITY_TYPES = new Set([
  "INLINE_INSPECTION", "MIDLINE_INSPECTION", "FINAL_INSPECTION",
  "METAL_DETECTION", "QA_APPROVAL",
]);

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED", "HOLD", "CANCELLED"];

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

// ─── Root component (role-aware) ─────────────────────────────────────────────

export default function QCDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "MERCHANDISER";
  return isAdmin ? <AdminQCView /> : <QCPersonalDashboard />;
}

// ═══════════════════════════════════════════════════════════════════════════
//  ADMIN / MERCHANDISER — list of QC employees
// ═══════════════════════════════════════════════════════════════════════════

function AdminQCView() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | OVERDUE | ACTIVE

  useEffect(() => {
    API.get("/qc/employees")
      .then((r) => setEmployees(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = employees;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      );
    }
    if (filter === "OVERDUE") list = list.filter((e) => e.stats.overdue > 0);
    if (filter === "ACTIVE")  list = list.filter((e) => e.stats.in_progress > 0);
    return list;
  }, [employees, search, filter]);

  const totals = useMemo(() => ({
    employees: employees.length,
    total_tasks: employees.reduce((s, e) => s + e.stats.total, 0),
    overdue:     employees.reduce((s, e) => s + e.stats.overdue, 0),
    completed:   employees.reduce((s, e) => s + e.stats.completed, 0),
  }), [employees]);

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Quality Control</h1>
            <p className="text-zinc-500 text-sm mt-0.5">QC team overview &amp; task tracking</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="QC Employees"  value={totals.employees}   gradient="from-teal-500 to-cyan-500"     icon={<User size={18} />} />
          <StatCard label="Total Tasks"   value={totals.total_tasks} gradient="from-blue-500 to-violet-500"   icon={<ClipboardList size={18} />} />
          <StatCard label="Completed"     value={totals.completed}   gradient="from-emerald-500 to-teal-500"  icon={<CheckCircle2 size={18} />} />
          <StatCard label="Overdue Tasks" value={totals.overdue}     gradient="from-red-500 to-rose-600"      icon={<AlertTriangle size={18} />} />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#151821] border border-[#2A3142] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-teal-500/40 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "ACTIVE", "OVERDUE"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  filter === f
                    ? "bg-teal-500/20 border-teal-500/40 text-teal-400"
                    : "bg-[#151821] border-[#2A3142] text-zinc-500 hover:text-white"
                }`}
              >
                {f === "ALL" ? "All" : f === "ACTIVE" ? "Active" : "Overdue"}
                {f === "OVERDUE" && totals.overdue > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px]">
                    {totals.overdue}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Employee Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-3">
            <ShieldCheck size={44} className="opacity-20" />
            <p className="text-sm">
              {employees.length === 0
                ? "No QC employees found. Create a user with the QC role to get started."
                : "No employees match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((emp) => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onClick={() => navigate(`/qc/employees/${emp.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function EmployeeCard({ emp, onClick }) {
  const { stats } = emp;
  const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="group text-left bg-[#151821] border border-[#2A3142] rounded-[24px] p-6 hover:border-teal-500/30 hover:bg-[#161D2A] transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            {emp.userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{emp.userName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Mail size={11} className="text-zinc-600 flex-shrink-0" />
              <p className="text-zinc-500 text-xs truncate">{emp.email}</p>
            </div>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="text-zinc-600 group-hover:text-teal-400 transition-colors mt-0.5 flex-shrink-0"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Done",  value: stats.completed,  color: "text-emerald-400" },
          { label: "Active", value: stats.in_progress, color: "text-orange-400" },
          { label: "Overdue", value: stats.overdue, color: stats.overdue > 0 ? "text-red-400" : "text-zinc-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0F141D] rounded-xl p-2.5 text-center">
            <p className={`text-lg font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Task completion</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#2A3142] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Overdue warning */}
      {stats.overdue > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
          <AlertTriangle size={11} />
          <span>{stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}</span>
        </div>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  QC ROLE — personal task dashboard
// ═══════════════════════════════════════════════════════════════════════════

function QCPersonalDashboard() {
  const { user } = useAuth();
  const [tnas, setTnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [editState, setEditState] = useState({});
  const [saving, setSaving] = useState({});

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    API.get("/styles/my-tnas")
      .then((res) => {
        setTnas(res.data);
        const groups = {};
        res.data.forEach((t) => { groups[t.po_id] = true; });
        setExpandedGroups(groups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const state = {};
    tnas.forEach((t) => {
      state[t.id] = {
        status: t.status,
        remarks: t.remarks || "",
        delayed_reason: t.delayed_reason || "",
      };
    });
    setEditState(state);
  }, [tnas]);

  const filteredTnas = useMemo(() => {
    if (filter === "QC_TASKS") return tnas.filter((t) => QC_ACTIVITY_TYPES.has(t.activity_type));
    if (filter === "OVERDUE")  return tnas.filter((t) => t.planned_date < today && t.status !== "COMPLETED" && t.status !== "CANCELLED");
    return tnas;
  }, [tnas, filter, today]);

  const grouped = useMemo(() => {
    const g = {};
    filteredTnas.forEach((t) => {
      if (!g[t.po_id]) g[t.po_id] = [];
      g[t.po_id].push(t);
    });
    return g;
  }, [filteredTnas]);

  const stats = useMemo(() => ({
    total:      tnas.length,
    pending:    tnas.filter((t) => t.status === "PENDING").length,
    inProgress: tnas.filter((t) => t.status === "IN_PROGRESS").length,
    completed:  tnas.filter((t) => t.status === "COMPLETED").length,
    overdue:    tnas.filter((t) => t.planned_date < today && t.status !== "COMPLETED" && t.status !== "CANCELLED").length,
  }), [tnas, today]);

  const setEdit = (tnaId, key, val) =>
    setEditState((prev) => ({ ...prev, [tnaId]: { ...prev[tnaId], [key]: val } }));

  const saveStatus = async (tnaId) => {
    const edit = editState[tnaId];
    setSaving((prev) => ({ ...prev, [tnaId]: "status" }));
    try {
      await API.patch(`/tnas/${tnaId}/status`, {
        status: edit.status,
        delayed_reason: edit.status === "DELAYED" ? edit.delayed_reason || null : null,
      });
      setTnas((prev) => prev.map((t) => t.id === tnaId ? { ...t, status: edit.status, delayed_reason: edit.delayed_reason } : t));
    } catch (err) { console.error(err); }
    finally { setSaving((prev) => ({ ...prev, [tnaId]: null })); }
  };

  const saveRemarks = async (tnaId) => {
    const edit = editState[tnaId];
    setSaving((prev) => ({ ...prev, [tnaId]: "remarks" }));
    try {
      await API.patch(`/tnas/${tnaId}`, { remarks: edit.remarks });
      setTnas((prev) => prev.map((t) => t.id === tnaId ? { ...t, remarks: edit.remarks } : t));
    } catch (err) { console.error(err); }
    finally { setSaving((prev) => ({ ...prev, [tnaId]: null })); }
  };

  if (loading) return <DashboardLayout><LoadingScreen /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 flex-shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">QC Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Quality Control · {user?.userName}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Tasks"  value={stats.total}      gradient="from-blue-500 to-violet-500"  icon={<ClipboardList size={18} />} />
          <StatCard label="Pending"      value={stats.pending}    gradient="from-zinc-500 to-zinc-600"    icon={<Clock size={18} />} />
          <StatCard label="In Progress"  value={stats.inProgress} gradient="from-orange-500 to-amber-500" icon={<Activity size={18} />} />
          <StatCard label="Completed"    value={stats.completed}  gradient="from-emerald-500 to-teal-500" icon={<CheckCircle2 size={18} />} />
          <StatCard label="Overdue"      value={stats.overdue}    gradient="from-red-500 to-rose-600"     icon={<AlertTriangle size={18} />} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "ALL",      label: "All Tasks" },
            { key: "QC_TASKS", label: "QC Tasks" },
            { key: "OVERDUE",  label: "Overdue" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter === key
                  ? "bg-teal-500/20 border-teal-500/40 text-teal-400"
                  : "bg-[#151821] border-[#2A3142] text-zinc-500 hover:text-white hover:border-zinc-500"
              }`}
            >
              {label}
              {key === "OVERDUE" && stats.overdue > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px]">
                  {stats.overdue}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 space-y-3">
            <ShieldCheck size={44} className="opacity-20" />
            <p className="text-sm">No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([poId, tasks]) => (
              <POGroup
                key={poId}
                poId={poId}
                tasks={tasks}
                expanded={!!expandedGroups[poId]}
                onToggle={() => setExpandedGroups((p) => ({ ...p, [poId]: !p[poId] }))}
                editState={editState}
                saving={saving}
                today={today}
                onStatusChange={(id, v)  => setEdit(id, "status", v)}
                onRemarksChange={(id, v) => setEdit(id, "remarks", v)}
                onDelayedChange={(id, v) => setEdit(id, "delayed_reason", v)}
                onSaveStatus={saveStatus}
                onSaveRemarks={saveRemarks}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── POGroup ────────────────────────────────────────────────────────────────

function POGroup({ poId, tasks, expanded, onToggle, editState, saving, today, onStatusChange, onRemarksChange, onDelayedChange, onSaveStatus, onSaveRemarks }) {
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center flex-shrink-0">
            <Package size={15} className="text-orange-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-sm">Order #{poId}</p>
            <p className="text-zinc-500 text-xs">{completed}/{tasks.length} completed</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-28 h-1.5 rounded-full bg-[#2A3142] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 w-8 text-right">{percent}%</span>
          </div>
          {expanded ? <ChevronUp size={15} className="text-zinc-500" /> : <ChevronDown size={15} className="text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#2A3142] divide-y divide-[#2A3142]/50">
          {tasks.map((tna) => (
            <TaskCard
              key={tna.id}
              tna={tna}
              edit={editState[tna.id] || { status: tna.status, remarks: tna.remarks || "", delayed_reason: tna.delayed_reason || "" }}
              saving={saving[tna.id]}
              today={today}
              onStatusChange={(v) => onStatusChange(tna.id, v)}
              onRemarksChange={(v) => onRemarksChange(tna.id, v)}
              onDelayedChange={(v) => onDelayedChange(tna.id, v)}
              onSaveStatus={() => onSaveStatus(tna.id)}
              onSaveRemarks={() => onSaveRemarks(tna.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TaskCard ───────────────────────────────────────────────────────────────

function TaskCard({ tna, edit, saving, today, onStatusChange, onRemarksChange, onDelayedChange, onSaveStatus, onSaveRemarks }) {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const isQcTask = QC_ACTIVITY_TYPES.has(tna.activity_type);
  const isOverdue = tna.planned_date && tna.planned_date < today && tna.status !== "COMPLETED" && tna.status !== "CANCELLED";
  const activityLabel = tna.activity_type === "CUSTOM" && tna.custom_name ? tna.custom_name : tna.activity_type.replaceAll("_", " ");

  return (
    <div className={`px-6 py-5 ${isQcTask ? "bg-teal-500/[0.025]" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isQcTask && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wide">
                QC
              </span>
            )}
            <span className="text-white font-bold text-sm">{activityLabel}</span>
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
            {tna.actual_date && <span className="text-emerald-400">Completed {tna.actual_date}</span>}
          </div>
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={edit.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`text-xs font-bold px-3 py-2 rounded-xl border bg-[#0F141D] cursor-pointer outline-none appearance-none transition-all ${STATUS_STYLES[edit.status] || ""}`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-[#151821] text-white font-normal">
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          {edit.status !== tna.status && (
            <button
              onClick={onSaveStatus}
              disabled={saving === "status"}
              className="px-3 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold hover:bg-teal-500/30 transition-all disabled:opacity-50"
            >
              {saving === "status" ? "..." : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Delayed reason */}
      {edit.status === "DELAYED" && (
        <div className="mt-3">
          <input
            type="text"
            value={edit.delayed_reason}
            onChange={(e) => onDelayedChange(e.target.value)}
            placeholder="Enter reason for delay..."
            className="w-full bg-[#0F141D] border border-red-500/20 rounded-xl px-3 py-2 text-xs text-red-400 placeholder-zinc-600 outline-none focus:border-red-500/40 transition-all"
          />
        </div>
      )}

      {/* Remarks */}
      <div className="mt-3">
        <button
          onClick={() => setRemarksOpen(!remarksOpen)}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-all group"
        >
          <MessageSquare size={12} className="group-hover:text-teal-400 transition-colors" />
          <span>{remarksOpen ? "Collapse" : tna.remarks ? "View / Edit remarks" : "Add remarks"}</span>
          {tna.remarks && !remarksOpen && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />}
        </button>
        {remarksOpen && (
          <div className="mt-2 space-y-2">
            <textarea
              value={edit.remarks}
              onChange={(e) => onRemarksChange(e.target.value)}
              placeholder="Write your remarks or comments here..."
              rows={3}
              className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl px-3 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-teal-500/40 resize-none transition-all"
            />
            {edit.remarks !== (tna.remarks || "") && (
              <button
                onClick={onSaveRemarks}
                disabled={saving === "remarks"}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold hover:bg-teal-500/30 transition-all disabled:opacity-50"
              >
                <Save size={11} />
                {saving === "remarks" ? "Saving..." : "Save Remarks"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function StatCard({ label, value, gradient, icon }) {
  return (
    <div className="bg-[#151821] border border-[#2A3142] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 text-sm animate-pulse">
      Loading QC Dashboard...
    </div>
  );
}

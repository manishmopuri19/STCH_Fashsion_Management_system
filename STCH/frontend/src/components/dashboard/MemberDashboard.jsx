import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import KPICard from "./KPICard";
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Activity,
} from "lucide-react";

const STATUS_COLORS = {
  PENDING: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  IN_PROGRESS: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DELAYED: "text-red-400 bg-red-500/10 border-red-500/20",
  HOLD: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CANCELLED: "text-zinc-600 bg-zinc-700/10 border-zinc-700/20",
};

function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-zinc-500 text-sm animate-pulse">
        Loading Dashboard...
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome, {user?.userName || "Team Member"}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Your assigned tasks and production milestones
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard
            title="Assigned TNAs"
            value={stats.total_assigned ?? 0}
            icon={<ClipboardList size={22} />}
            color="from-blue-500 to-violet-500"
          />
          <KPICard
            title="Pending"
            value={stats.pending ?? 0}
            icon={<Clock size={22} />}
            color="from-zinc-500 to-zinc-600"
          />
          <KPICard
            title="In Progress"
            value={stats.in_progress ?? 0}
            icon={<Activity size={22} />}
            color="from-orange-500 to-amber-500"
          />
          <KPICard
            title="Completed"
            value={stats.completed ?? 0}
            icon={<CheckCircle2 size={22} />}
            color="from-emerald-500 to-teal-500"
          />
          <KPICard
            title="Overdue"
            value={stats.delayed ?? 0}
            icon={<AlertTriangle size={22} />}
            color="from-red-500 to-orange-500"
          />
          <KPICard
            title="Orders Visible"
            value={stats.accessible_pos ?? 0}
            icon={<Package size={22} />}
            color="from-purple-500 to-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Overdue TNAs */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <h2 className="text-lg font-black text-white">Overdue Milestones</h2>
            </div>

            {!data?.overdue_tnas?.length ? (
              <p className="text-zinc-600 text-sm py-6 text-center">No overdue milestones — you're on track!</p>
            ) : (
              <div className="space-y-3">
                {data.overdue_tnas.map((tna) => (
                  <div
                    key={tna.id}
                    onClick={() => navigate(`/orders/${tna.po_id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#0F141D] border border-red-500/10 hover:border-red-500/30 cursor-pointer transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {tna.activity.replaceAll("_", " ")}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {tna.style_code && <span className="text-orange-400 font-mono">{tna.style_code} · </span>}
                        Due {tna.planned_date}
                      </p>
                      {tna.delayed_reason && (
                        <p className="text-red-400 text-xs mt-0.5 italic truncate">{tna.delayed_reason}</p>
                      )}
                    </div>
                    <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-lg border text-xs font-bold ${STATUS_COLORS[tna.status] || ""}`}>
                      {tna.status.replaceAll("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming TNAs */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              <h2 className="text-lg font-black text-white">Due in 7 Days</h2>
            </div>

            {!data?.upcoming_tnas?.length ? (
              <p className="text-zinc-600 text-sm py-6 text-center">No milestones due in the next 7 days.</p>
            ) : (
              <div className="space-y-3">
                {data.upcoming_tnas.map((tna) => (
                  <div
                    key={tna.id}
                    onClick={() => navigate(`/orders/${tna.po_id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#0F141D] border border-[#2A3142] hover:border-orange-500/30 cursor-pointer transition-all"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {tna.activity.replaceAll("_", " ")}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {tna.style_code && <span className="text-orange-400 font-mono">{tna.style_code} · </span>}
                        Due {tna.planned_date}
                      </p>
                    </div>
                    <span className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-lg border text-xs font-bold ${STATUS_COLORS[tna.status] || ""}`}>
                      {tna.status.replaceAll("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default MemberDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ClipboardList, FileText, ArrowRight, Loader2, Users } from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import QCWorkerDashboard from "./QCWorkerDashboard";

function QCPage() {
  const { user } = useAuth();

  if (user?.role === "QUALITY_CONTROL") {
    return <QCWorkerDashboard />;
  }

  return <QCTeamManagementPage />;
}

function QCTeamManagementPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users/qc-team")
      .then((res) => setTeam(res.data))
      .catch(() => setError("Failed to load QC team."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Quality Control</h1>
              <p className="text-zinc-500 text-xs mt-0.5">Manage and track your QC team's assignments</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="text-orange-500 animate-spin" size={32} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 text-red-400 text-sm">{error}</div>
        ) : team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[#2A3142] rounded-[28px] text-center">
            <Users size={40} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-semibold text-base">No QC team members yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Add users with the Quality Control role in User Management.
            </p>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm">{team.length} member{team.length !== 1 ? "s" : ""} in QC team</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((member) => (
                <QCMemberCard
                  key={member.id}
                  member={member}
                  onClick={() => navigate(`/qc/${member.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function QCMemberCard({ member, onClick }) {
  const initials = member.userName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "QC";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-[22px] border border-[#2A3142] bg-[#151821] p-6 space-y-5 hover:border-emerald-500/40 hover:bg-[#1A1F2E] transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold truncate">{member.userName}</p>
            <p className="text-zinc-500 text-xs truncate mt-0.5">{member.email}</p>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-zinc-600 group-hover:text-emerald-400 transition-all flex-shrink-0"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#2A3142]">
        <StatPill icon={<FileText size={13} className="text-orange-400" />} label="RFQs" value={member.rfq_count} />
        <StatPill icon={<ClipboardList size={13} className="text-blue-400" />} label="TNAs" value={member.tna_count} />
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      {icon}
      <span className="font-bold text-white">{value}</span>
      <span>{label}</span>
    </div>
  );
}

export default QCPage;

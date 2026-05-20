import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, TestTube2, CheckCircle2, Clock, XCircle,
  AlertCircle, Upload, MessageSquare, Calendar, ChevronDown, ChevronUp
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatusPill from "../../components/rfq/workflow/StatusPill";
import UploadZone from "../../components/rfq/workflow/UploadZone";
import { useAuth } from "../../context/AuthContext";

const SAMPLE_META = {
  PROTO: {
    label: "Proto Sample",
    description: "First physical prototype — shape, construction & concept validation",
    color: "blue",
    icon: TestTube2,
  },
  FIT: {
    label: "Fit Sample",
    description: "Size grading, measurements & fit validation on fit model",
    color: "violet",
    icon: CheckCircle2,
  },
  PP: {
    label: "PP Sample",
    description: "Pre-Production sample — exact production materials & process",
    color: "orange",
    icon: AlertCircle,
  },
  SIZE_SET: {
    label: "Size Set",
    description: "Full size run for measurement & grading approval",
    color: "emerald",
    icon: CheckCircle2,
  },
  SHIPMENT: {
    label: "Shipment Sample",
    description: "Final random sample from production cartons",
    color: "pink",
    icon: CheckCircle2,
  },
};

const STATUS_ICON = {
  NOT_STARTED: { icon: Clock,        color: "text-zinc-500" },
  SUBMITTED:   { icon: Upload,       color: "text-violet-400" },
  UNDER_REVIEW:{ icon: AlertCircle,  color: "text-yellow-400" },
  APPROVED:    { icon: CheckCircle2, color: "text-emerald-400" },
  REJECTED:    { icon: XCircle,      color: "text-red-400" },
};

const ACCENT = {
  blue:    { border: "border-blue-500/20",    bg: "bg-blue-500/5",    tag: "text-blue-400" },
  violet:  { border: "border-violet-500/20",  bg: "bg-violet-500/5",  tag: "text-violet-400" },
  orange:  { border: "border-orange-500/20",  bg: "bg-orange-500/5",  tag: "text-orange-400" },
  emerald: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", tag: "text-emerald-400" },
  pink:    { border: "border-pink-500/20",    bg: "bg-pink-500/5",    tag: "text-pink-400" },
};

function SampleCard({ sample, onSave, onStatusChange, canEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({
    comments:       sample.comments       ?? "",
    file_url:       sample.file_url       ?? "",
    submitted_date: sample.submitted_date ?? "",
    approved_date:  sample.approved_date  ?? "",
    status:         sample.status         ?? "NOT_STARTED",
  });
  const [saving, setSaving] = useState(false);

  const meta   = SAMPLE_META[sample.sample_type] || {};
  const accent = ACCENT[meta.color || "blue"];
  const Icon   = meta.icon || TestTube2;
  const statusMeta = STATUS_ICON[draft.status] || STATUS_ICON.NOT_STARTED;
  const StatusIcon = statusMeta.icon;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(sample.sample_type, draft);
    } finally { setSaving(false); }
  };

  return (
    <div className={`bg-[#0F141D] border rounded-2xl overflow-hidden transition-all ${accent.border}`}>
      {/* HEADER ROW */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#151821] transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent.bg}`}>
          <Icon size={16} className={accent.tag} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-white text-sm">{meta.label}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{meta.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={draft.status} />
          {expanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </button>

      {/* EXPANDED BODY */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-[#2A3142] pt-5 space-y-4">
          {/* STATUS & DATES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Sample Status</label>
              <select
                value={draft.status}
                onChange={e => setDraft(p => ({ ...p, status: e.target.value }))}
                disabled={!canEdit}
                className="w-full px-3 py-2.5 bg-[#151821] border border-[#2A3142] rounded-xl text-sm text-white outline-none focus:border-orange-500/50 disabled:opacity-50"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Submitted Date</label>
              <input type="date" value={draft.submitted_date} onChange={e => setDraft(p=>({...p, submitted_date: e.target.value}))} disabled={!canEdit}
                className="w-full px-3 py-2.5 bg-[#151821] border border-[#2A3142] rounded-xl text-sm text-zinc-300 outline-none focus:border-orange-500/50 disabled:opacity-50" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Approved Date</label>
              <input type="date" value={draft.approved_date} onChange={e => setDraft(p=>({...p, approved_date: e.target.value}))} disabled={!canEdit}
                className="w-full px-3 py-2.5 bg-[#151821] border border-[#2A3142] rounded-xl text-sm text-zinc-300 outline-none focus:border-orange-500/50 disabled:opacity-50" />
            </div>
          </div>

          {/* FILE & COMMENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UploadZone label="Sample File / Image" value={draft.file_url} onChange={v => setDraft(p => ({ ...p, file_url: v }))} hint="jpg, png, pdf" />
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Comments & Feedback</label>
              <textarea
                value={draft.comments}
                onChange={e => setDraft(p => ({ ...p, comments: e.target.value }))}
                disabled={!canEdit}
                rows={4}
                placeholder="Fit notes, measurement corrections, approval comments..."
                className="w-full px-3 py-2.5 bg-[#151821] border border-[#2A3142] rounded-xl text-sm text-zinc-300 outline-none resize-none focus:border-orange-500/50 placeholder:text-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-all disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Sample"}
              </button>
              {draft.status !== "APPROVED" && (
                <button
                  onClick={() => { setDraft(p => ({ ...p, status: "APPROVED", approved_date: new Date().toISOString().split("T")[0] })); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all"
                >
                  <CheckCircle2 size={14} /> Approve Sample
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SamplingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [samples, setSamples]     = useState([]);
  const [rfqNumber, setRfqNumber] = useState("");

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [sampRes, rfqRes] = await Promise.all([
        API.get(`/rfqs/${id}/sampling/`),
        API.get(`/rfqs/${id}`),
      ]);
      setRfqNumber(rfqRes.data.rfq_number);
      setSamples(sampRes.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async (sampleType, draft) => {
    try {
      const payload = {
        sample_type:    sampleType,
        status:         draft.status,
        comments:       draft.comments   || null,
        file_url:       draft.file_url   || null,
        submitted_date: draft.submitted_date || null,
        approved_date:  draft.approved_date  || null,
      };
      await API.put(`/rfqs/${id}/sampling/`, payload);
      await fetchData();
    } catch (e) { console.error(e); }
  };

  const approvedCount = samples.filter(s => s.status === "APPROVED").length;

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] mx-auto space-y-6 text-white">

          {/* HEADER */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
            <button onClick={() => navigate(`/rfqs/${id}`)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to RFQ
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <TestTube2 size={18} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Sampling Tracker</h1>
                  <p className="text-zinc-500 text-sm">{rfqNumber} · {approvedCount} of {samples.length} samples approved</p>
                </div>
              </div>
              {/* PROGRESS PILL */}
              <div className="flex items-center gap-3 bg-[#0F141D] border border-[#2A3142] rounded-2xl px-5 py-3">
                <div className="w-28 h-1.5 bg-[#1D2230] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${samples.length ? (approvedCount / samples.length) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-medium text-zinc-300">{approvedCount}/{samples.length}</span>
              </div>
            </div>
          </div>

          {/* SAMPLE TIMELINE NOTE */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-2xl px-5 py-3 flex items-center gap-3">
            <AlertCircle size={14} className="text-orange-400 shrink-0" />
            <p className="text-sm text-zinc-400">
              PP Sample must be <span className="text-orange-400 font-medium">Approved</span> before PO creation is unlocked.
              Other samples are tracked for audit purposes.
            </p>
          </div>

          {/* SAMPLE CARDS */}
          <div className="space-y-3">
            {samples.map(sample => (
              <SampleCard
                key={sample.sample_type}
                sample={sample}
                onSave={handleSave}
                canEdit={canEdit}
              />
            ))}
          </div>
      </div>
    </DashboardLayout>
  );
}

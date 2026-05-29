import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Ruler, Layers, TrendingUp, Calculator,
  Save, CheckCircle2, BarChart2, Zap, Eye
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import MetricCard from "../../components/rfq/workflow/MetricCard";
import UploadZone from "../../components/rfq/workflow/UploadZone";
import StatusPill from "../../components/rfq/workflow/StatusPill";
import { useAuth } from "../../context/AuthContext";

const INPUT_FIELD = ({ label, value, onChange, unit, type = "number", placeholder, disabled }) => (
  <div>
    <label className="block text-sm text-zinc-400 mb-2">{label}</label>
    <div className={`flex items-center bg-[#0F141D] border rounded-xl overflow-hidden transition-all ${disabled ? "border-[#1E2533] opacity-60" : "border-[#2A3142] focus-within:border-orange-500/50"}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={disabled ? "—" : (placeholder || label)}
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-transparent text-white outline-none text-sm placeholder:text-zinc-600 disabled:cursor-not-allowed"
      />
      {unit && (
        <span className="px-3 text-xs text-zinc-500 border-l border-[#2A3142] h-full flex items-center py-3 bg-[#0B0F19]">
          {unit}
        </span>
      )}
    </div>
  </div>
);

function calc(form) {
  const consumption   = parseFloat(form.consumption)    || 0;
  const wastage       = parseFloat(form.wastage_pct)     || 0;
  const fabricCost    = parseFloat(form.fabric_cost)     || 0;
  const markerEff     = parseFloat(form.marker_efficiency) || 0;

  const totalFabric   = consumption > 0 ? consumption * (1 + wastage / 100) : null;
  const yieldVal      = markerEff > 0 ? (markerEff / 100).toFixed(4) : null;
  const fabUtil       = markerEff > 0 ? markerEff.toFixed(1) : null;
  const cpp           = totalFabric && fabricCost ? (totalFabric * fabricCost).toFixed(2) : null;
  const marginImpact  = cpp && fabricCost ? (((parseFloat(cpp) / fabricCost) - 1) * 100).toFixed(1) : null;

  return { totalFabric: totalFabric?.toFixed(3), yieldVal, fabUtil, cpp, marginImpact };
}

export default function MiniMarkerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [form, setForm] = useState({
    fabric_width: "", gsm: "", size_ratio: "", marker_efficiency: "",
    wastage_pct: "", consumption: "", cad_ratio: "", fabric_cost: "",
    cad_file_url: "", marker_image_url: "",
  });
  const [status, setStatus] = useState("NOT_STARTED");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rfqNumber, setRfqNumber] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [mmRes, rfqRes] = await Promise.all([
        API.get(`/rfqs/${id}/mini-marker/`),
        API.get(`/rfqs/${id}`),
      ]);
      const d = mmRes.data;
      setRfqNumber(rfqRes.data.rfq_number);
      setStatus(d.status || "NOT_STARTED");
      setForm({
        fabric_width:       d.fabric_width      ?? "",
        gsm:                d.gsm               ?? "",
        size_ratio:         d.size_ratio        ?? "",
        marker_efficiency:  d.marker_efficiency ?? "",
        wastage_pct:        d.wastage_pct       ?? "",
        consumption:        d.consumption       ?? "",
        cad_ratio:          d.cad_ratio         ?? "",
        fabric_cost:        d.fabric_cost       ?? "",
        cad_file_url:       d.cad_file_url      ?? "",
        marker_image_url:   d.marker_image_url  ?? "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const field = (key) => ({ value: form[key], onChange: (e) => setForm(p => ({ ...p, [key]: e.target.value })), disabled: !canEdit });
  const metrics = calc(form);

  const handleSave = async (newStatus) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      const payload = {
        ...Object.fromEntries(
          Object.entries(form).map(([k, v]) => [k, v === "" ? null : (isNaN(Number(v)) ? v : (k === "size_ratio" ? v : Number(v)))])
        ),
        status: newStatus || status,
      };
      await API.put(`/rfqs/${id}/mini-marker/`, payload);
      setStatus(newStatus || status);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 text-white">

          {/* HEADER */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
            <button onClick={() => navigate(`/rfqs/${id}`)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to RFQ
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Ruler size={18} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Mini Marker</h1>
                    <p className="text-zinc-500 text-sm">{rfqNumber} · Fabric Engineering Workspace</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={status} />
                {canEdit ? (
                  <select
                    value={status}
                    onChange={(e) => handleSave(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-zinc-300 outline-none"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-xs text-zinc-500">
                    <Eye size={13} /> View Only
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* INPUTS COLUMN */}
            <div className="xl:col-span-2 space-y-6">

              {/* SECTION 1: INPUTS */}
              <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2533] flex items-center justify-center"><Layers size={18} className="text-orange-400" /></div>
                  <h2 className="text-xl font-semibold">Marker Inputs</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <INPUT_FIELD label="Fabric Width" unit="cm" placeholder="e.g. 150" {...field("fabric_width")} />
                  <INPUT_FIELD label="GSM" unit="g/m²" placeholder="e.g. 220" {...field("gsm")} />
                  <INPUT_FIELD label="Size Ratio" type="text" placeholder="S:M:L:XL = 1:2:2:1" {...field("size_ratio")} />
                  <INPUT_FIELD label="Marker Efficiency" unit="%" placeholder="e.g. 82" {...field("marker_efficiency")} />
                  <INPUT_FIELD label="Wastage" unit="%" placeholder="e.g. 8" {...field("wastage_pct")} />
                  <INPUT_FIELD label="Consumption" unit="m/pc" placeholder="e.g. 1.85" {...field("consumption")} />
                  <INPUT_FIELD label="CAD Ratio" placeholder="e.g. 1.05" {...field("cad_ratio")} />
                  <INPUT_FIELD label="Fabric Cost" unit="₹/m" placeholder="e.g. 4.50" {...field("fabric_cost")} />
                </div>
              </div>

              {/* SECTION 3: UPLOADS */}
              <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2533] flex items-center justify-center"><BarChart2 size={18} className="text-blue-400" /></div>
                  <h2 className="text-xl font-semibold">Uploads & CAD Files</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <UploadZone
                    label="CAD Marker File"
                    value={form.cad_file_url}
                    onChange={(v) => setForm(p => ({ ...p, cad_file_url: v }))}
                    hint=".plt, .dxf, .pdf"
                    readOnly={!canEdit}
                  />
                  <UploadZone
                    label="Marker Image"
                    value={form.marker_image_url}
                    onChange={(v) => setForm(p => ({ ...p, marker_image_url: v }))}
                    hint=".jpg, .png, .pdf"
                    readOnly={!canEdit}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* SECTION 2: CALCULATED METRICS */}
              <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1E2533] flex items-center justify-center"><Calculator size={18} className="text-emerald-400" /></div>
                  <h2 className="text-xl font-semibold">Auto Calculations</h2>
                </div>
                <div className="space-y-4">
                  <MetricCard label="Total Fabric Required" value={metrics.totalFabric} unit="m/pc" />
                  <MetricCard label="Yield" value={metrics.yieldVal} />
                  <MetricCard label="Fabric Utilization" value={metrics.fabUtil} unit="%" />
                  <MetricCard label="Cost Per Piece" value={metrics.cpp} unit="₹" accent />
                  <MetricCard label="Marker Efficiency" value={form.marker_efficiency || "—"} unit="%" />
                  <MetricCard label="Est. Margin Impact" value={metrics.marginImpact} unit="%" sublabel="vs raw fabric cost" />
                </div>
              </div>

              {/* SAVE ACTIONS */}
              {canEdit && (
                <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6 space-y-3">
                  <h2 className="text-lg font-semibold">Save Changes</h2>
                  <button
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    {saving ? "Saving..." : saved ? "Saved!" : "Save Mini Marker"}
                  </button>
                  <button
                    onClick={() => handleSave("COMPLETED")}
                    disabled={saving}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    <Zap size={16} /> Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>
    </DashboardLayout>
  );
}

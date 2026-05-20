import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Shirt, Image, Tag, Scissors, Package, Palette, Save, Zap, BookOpen
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatusPill from "../../components/rfq/workflow/StatusPill";
import UploadZone from "../../components/rfq/workflow/UploadZone";
import { useAuth } from "../../context/AuthContext";

const FIT_TYPES = ["Regular", "Slim", "Relaxed", "Oversized", "Athletic", "Tapered", "Straight", "Skinny", "Cropped", "Other"];

const TextareaField = ({ label, icon: Icon, value, onChange, placeholder, rows = 4, disabled }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon size={14} className="text-zinc-500" />}
      <label className="text-sm text-zinc-400">{label}</label>
    </div>
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder || label}
      rows={rows}
      className="w-full px-4 py-3 bg-[#0F141D] border border-[#2A3142] rounded-xl text-white text-sm outline-none resize-none focus:border-orange-500/50 placeholder:text-zinc-600 transition-all disabled:opacity-50"
    />
  </div>
);

const MODULE = ({ title, icon: Icon, iconColor = "text-orange-400", children }) => (
  <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-[#1E2533] flex items-center justify-center">
        <Icon size={16} className={iconColor} />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default function StyleSheetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [form, setForm] = useState({
    front_image_url: "", back_image_url: "",
    fabric_details: "", wash_details: "", stitch_details: "",
    fit_type: "Regular",
    label_placement: "", artwork_notes: "", packaging_notes: "",
  });
  const [status, setStatus]     = useState("NOT_STARTED");
  const [rfqNumber, setRfqNumber] = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [ssRes, rfqRes] = await Promise.all([
        API.get(`/rfqs/${id}/style-sheet/`),
        API.get(`/rfqs/${id}`),
      ]);
      setRfqNumber(rfqRes.data.rfq_number);
      const d = ssRes.data;
      setStatus(d.status || "NOT_STARTED");
      setForm({
        front_image_url:  d.front_image_url  ?? "",
        back_image_url:   d.back_image_url   ?? "",
        fabric_details:   d.fabric_details   ?? "",
        wash_details:     d.wash_details     ?? "",
        stitch_details:   d.stitch_details   ?? "",
        fit_type:         d.fit_type         ?? "Regular",
        label_placement:  d.label_placement  ?? "",
        artwork_notes:    d.artwork_notes    ?? "",
        packaging_notes:  d.packaging_notes  ?? "",
      });
    } catch (e) { console.error(e); }
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm(p => ({ ...p, [key]: e.target.value })),
    disabled: !canEdit,
  });

  const handleSave = async (newStatus) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      const payload = { ...form, status: newStatus || status };
      Object.keys(payload).forEach(k => { if (payload[k] === "") payload[k] = null; });
      await API.put(`/rfqs/${id}/style-sheet/`, payload);
      if (newStatus) setStatus(newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1300px] mx-auto space-y-6 text-white">

          {/* HEADER */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
            <button onClick={() => navigate(`/rfqs/${id}`)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to RFQ
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Style Sheet</h1>
                  <p className="text-zinc-500 text-sm">{rfqNumber} · Technical Garment Specification</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={status} />
                {canEdit && (
                  <>
                    <select value={status} onChange={e => { setStatus(e.target.value); handleSave(e.target.value); }}
                      className="px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-zinc-300 outline-none">
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="APPROVED">Approved</option>
                    </select>
                    <button onClick={() => handleSave()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-all">
                      <Save size={14} /> {saving ? "Saving..." : saved ? "Saved!" : "Save"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* GARMENT IMAGES */}
            <MODULE title="Garment Images" icon={Image} iconColor="text-blue-400">
              <div className="grid grid-cols-2 gap-4">
                <UploadZone label="Front View" value={form.front_image_url} onChange={v => setForm(p=>({...p, front_image_url: v}))} hint="JPEG, PNG" />
                <UploadZone label="Back View"  value={form.back_image_url}  onChange={v => setForm(p=>({...p, back_image_url: v}))}  hint="JPEG, PNG" />
              </div>
            </MODULE>

            {/* FIT TYPE */}
            <MODULE title="Fit & Construction" icon={Shirt} iconColor="text-violet-400">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Fit Type</label>
                <select
                  value={form.fit_type}
                  onChange={e => setForm(p=>({...p, fit_type: e.target.value}))}
                  disabled={!canEdit}
                  className="w-full px-4 py-3 bg-[#0F141D] border border-[#2A3142] rounded-xl text-white text-sm outline-none focus:border-orange-500/50 transition-all disabled:opacity-50"
                >
                  {FIT_TYPES.map(t => <option key={t} value={t} className="bg-[#151821]">{t}</option>)}
                </select>
              </div>
              <div className="mt-4">
                <TextareaField label="Stitch Details" icon={Scissors} {...f("stitch_details")} placeholder="SPI, stitch type, seam allowance..." />
              </div>
            </MODULE>

            {/* FABRIC DETAILS */}
            <MODULE title="Fabric Specification" icon={Palette} iconColor="text-emerald-400">
              <TextareaField label="Fabric Details" {...f("fabric_details")} placeholder="GSM, composition, weave type, shrinkage, etc." rows={5} />
            </MODULE>

            {/* WASH DETAILS */}
            <MODULE title="Wash & Treatment" icon={Scissors} iconColor="text-orange-400">
              <TextareaField label="Wash Details" {...f("wash_details")} placeholder="Wash type, temperature, chemical process, finish..." rows={5} />
            </MODULE>

            {/* LABEL PLACEMENT */}
            <MODULE title="Labels & Tags" icon={Tag} iconColor="text-yellow-400">
              <TextareaField label="Label Placement" {...f("label_placement")} placeholder="Care label, brand label, size label positions..." rows={4} />
            </MODULE>

            {/* PACKAGING */}
            <MODULE title="Packaging Notes" icon={Package} iconColor="text-pink-400">
              <TextareaField label="Packaging Notes" {...f("packaging_notes")} placeholder="Folding, poly bag, hangtag, carton details..." rows={4} />
            </MODULE>

            {/* ARTWORK */}
            <div className="lg:col-span-2">
              <MODULE title="Artwork & Print Notes" icon={Palette} iconColor="text-cyan-400">
                <TextareaField label="Artwork Notes" {...f("artwork_notes")} placeholder="Print placement, color references, embroidery instructions, PMS codes..." rows={4} />
              </MODULE>
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end gap-3">
              <button onClick={() => handleSave()}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-medium transition-all">
                <Save size={16} /> {saving ? "Saving..." : "Save Style Sheet"}
              </button>
              <button onClick={() => handleSave("COMPLETED")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all">
                <Zap size={16} /> Mark as Completed
              </button>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

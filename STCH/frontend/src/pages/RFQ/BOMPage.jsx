import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, List, Plus, Trash2, Edit2, Check, X, Save, Zap, Package2, Eye
} from "lucide-react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatusPill from "../../components/rfq/workflow/StatusPill";
import { useAuth } from "../../context/AuthContext";

const UNITS    = ["meters", "pcs", "kg", "sets", "rolls", "yards", "gsm", "mm", "liters"];
const MAT_TYPES = ["Fabric", "Lining", "Interlining", "Trim", "Button", "Zipper", "Label", "Hang Tag", "Thread", "Packaging", "Other"];

const EMPTY_ITEM = { material: "", material_type: "Fabric", consumption: "", unit: "meters", cost: "", supplier: "", remarks: "" };

function BOMRow({ item, onUpdate, onDelete, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...item });

  const save = () => { onUpdate(draft); setEditing(false); };
  const cancel = () => { setDraft({ ...item }); setEditing(false); };

  const cellClass = "px-3 py-3 text-sm text-zinc-300 border-r border-[#2A3142] last:border-r-0";
  const inputClass = "w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-600";

  if (editing) {
    return (
      <tr className="bg-orange-500/5 border-b border-[#2A3142]">
        <td className={cellClass}><input className={inputClass} value={draft.material} onChange={e => setDraft(p=>({...p, material: e.target.value}))} placeholder="Material name" /></td>
        <td className={cellClass}>
          <select className="bg-transparent text-white text-sm outline-none w-full" value={draft.material_type} onChange={e => setDraft(p=>({...p, material_type: e.target.value}))}>
            {MAT_TYPES.map(t => <option key={t} value={t} className="bg-[#151821]">{t}</option>)}
          </select>
        </td>
        <td className={cellClass}><input className={inputClass} type="number" value={draft.consumption} onChange={e => setDraft(p=>({...p, consumption: e.target.value}))} /></td>
        <td className={cellClass}>
          <select className="bg-transparent text-white text-sm outline-none" value={draft.unit} onChange={e => setDraft(p=>({...p, unit: e.target.value}))}>
            {UNITS.map(u => <option key={u} value={u} className="bg-[#151821]">{u}</option>)}
          </select>
        </td>
        <td className={cellClass}><input className={inputClass} type="number" value={draft.cost} onChange={e => setDraft(p=>({...p, cost: e.target.value}))} /></td>
        <td className={cellClass}><input className={inputClass} value={draft.supplier} onChange={e => setDraft(p=>({...p, supplier: e.target.value}))} /></td>
        <td className={cellClass}><input className={inputClass} value={draft.remarks} onChange={e => setDraft(p=>({...p, remarks: e.target.value}))} /></td>
        <td className="px-3 py-3">
          <div className="flex gap-2">
            <button onClick={save} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
            <button onClick={cancel} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-[#2A3142] hover:bg-[#1D2230]/50 transition-colors group">
      <td className={cellClass}><span className="font-medium text-white">{item.material || "—"}</span></td>
      <td className={cellClass}><span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.material_type || "—"}</span></td>
      <td className={cellClass}>{item.consumption ?? "—"}</td>
      <td className={cellClass}><span className="text-zinc-400">{item.unit || "—"}</span></td>
      <td className={cellClass}><span className="font-medium">₹{Number(item.cost || 0).toFixed(2)}</span></td>
      <td className={cellClass}>{item.supplier || "—"}</td>
      <td className={`${cellClass} max-w-[140px]`}><span className="truncate block text-zinc-500">{item.remarks || "—"}</span></td>
      <td className="px-3 py-3">
        {canEdit && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setEditing(true)} className="text-zinc-400 hover:text-white"><Edit2 size={14} /></button>
            <button onClick={onDelete} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
          </div>
        )}
      </td>
    </tr>
  );
}

function AddRow({ onAdd, onCancel }) {
  const [draft, setDraft] = useState({ ...EMPTY_ITEM });
  const cellClass = "px-3 py-3 border-r border-[#2A3142] last:border-r-0";
  const inputClass = "w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-600";

  return (
    <tr className="bg-emerald-500/5 border-b border-[#2A3142]">
      <td className={cellClass}><input className={inputClass} value={draft.material} onChange={e => setDraft(p=>({...p, material: e.target.value}))} placeholder="Material name *" /></td>
      <td className={cellClass}>
        <select className="bg-transparent text-white text-sm outline-none w-full" value={draft.material_type} onChange={e => setDraft(p=>({...p, material_type: e.target.value}))}>
          {MAT_TYPES.map(t => <option key={t} value={t} className="bg-[#151821]">{t}</option>)}
        </select>
      </td>
      <td className={cellClass}><input className={inputClass} type="number" value={draft.consumption} onChange={e => setDraft(p=>({...p, consumption: e.target.value}))} placeholder="0" /></td>
      <td className={cellClass}>
        <select className="bg-transparent text-white text-sm outline-none" value={draft.unit} onChange={e => setDraft(p=>({...p, unit: e.target.value}))}>
          {UNITS.map(u => <option key={u} value={u} className="bg-[#151821]">{u}</option>)}
        </select>
      </td>
      <td className={cellClass}><input className={inputClass} type="number" value={draft.cost} onChange={e => setDraft(p=>({...p, cost: e.target.value}))} placeholder="0.00" /></td>
      <td className={cellClass}><input className={inputClass} value={draft.supplier} onChange={e => setDraft(p=>({...p, supplier: e.target.value}))} placeholder="Supplier" /></td>
      <td className={cellClass}><input className={inputClass} value={draft.remarks} onChange={e => setDraft(p=>({...p, remarks: e.target.value}))} placeholder="Remarks" /></td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button onClick={() => { if (draft.material.trim()) { onAdd(draft); setDraft({...EMPTY_ITEM}); } }} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
          <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-300"><X size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function BOMPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [items, setItems]     = useState([]);
  const [status, setStatus]   = useState("NOT_STARTED");
  const [rfqNumber, setRfqNumber] = useState("");
  const [addingRow, setAddingRow] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [bomRes, rfqRes] = await Promise.all([
        API.get(`/rfqs/${id}/bom/`),
        API.get(`/rfqs/${id}`),
      ]);
      setRfqNumber(rfqRes.data.rfq_number);
      setStatus(bomRes.data.status || "NOT_STARTED");
      setItems(bomRes.data.items || []);
    } catch (e) { console.error(e); }
  };

  const handleSave = async (newStatus) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      await API.put(`/rfqs/${id}/bom/`, {
        status: newStatus || status,
        items: items.map((item, idx) => ({
          material:      item.material,
          material_type: item.material_type,
          consumption:   item.consumption ? Number(item.consumption) : null,
          unit:          item.unit,
          cost:          item.cost ? Number(item.cost) : null,
          supplier:      item.supplier,
          remarks:       item.remarks,
          sort_order:    idx,
        })),
      });
      if (newStatus) setStatus(newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await fetchData();
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleUpdate = (index, updated) => {
    setItems(p => p.map((item, i) => i === index ? { ...item, ...updated } : item));
  };

  const handleDelete = (index) => {
    setItems(p => p.filter((_, i) => i !== index));
  };

  const handleAdd = (newItem) => {
    setItems(p => [...p, { ...newItem, id: `temp-${Date.now()}` }]);
    setAddingRow(false);
  };

  const totalCost = items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 text-white">

          {/* HEADER */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-7">
            <button onClick={() => navigate(`/rfqs/${id}`)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={16} /> Back to RFQ
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <List size={18} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Bill of Materials</h1>
                  <p className="text-zinc-500 text-sm">{rfqNumber} · {items.length} materials · Total ₹{totalCost.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={status} />
                {canEdit ? (
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
                      <Save size={14} /> {saving ? "Saving..." : saved ? "Saved!" : "Save BOM"}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-xs text-zinc-500">
                    <Eye size={13} /> View Only
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#2A3142]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1E2533] flex items-center justify-center"><Package2 size={16} className="text-blue-400" /></div>
                <h2 className="text-lg font-semibold">Materials List</h2>
              </div>
              {canEdit && (
                <button onClick={() => setAddingRow(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-zinc-300 hover:bg-[#283041] hover:text-white hover:border-orange-500/40 transition-all">
                  <Plus size={14} /> Add Material
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0F141D] border-b border-[#2A3142]">
                    {["Material", "Type", "Consumption", "Unit", "Cost", "Supplier", "Remarks", ""].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs text-zinc-500 font-medium uppercase tracking-wide border-r border-[#2A3142] last:border-r-0 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <BOMRow
                      key={item.id || idx}
                      item={item}
                      onUpdate={(updated) => handleUpdate(idx, updated)}
                      onDelete={() => handleDelete(idx)}
                      canEdit={canEdit}
                    />
                  ))}
                  {addingRow && (
                    <AddRow
                      onAdd={handleAdd}
                      onCancel={() => setAddingRow(false)}
                    />
                  )}
                  {items.length === 0 && !addingRow && (
                    <tr>
                      <td colSpan={8} className="px-7 py-12 text-center text-zinc-500 text-sm">
                        No materials added yet.{canEdit && " Click 'Add Material' to begin."}
                      </td>
                    </tr>
                  )}
                </tbody>
                {items.length > 0 && (
                  <tfoot>
                    <tr className="bg-[#0F141D] border-t border-[#2A3142]">
                      <td colSpan={4} className="px-3 py-3 text-xs text-zinc-500 font-medium uppercase">Total</td>
                      <td className="px-3 py-3 text-sm font-bold text-white">₹{totalCost.toFixed(2)}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* MARK COMPLETE */}
          {canEdit && (
            <div className="flex justify-end">
              <button onClick={() => handleSave("COMPLETED")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all">
                <Zap size={16} /> Mark BOM as Completed
              </button>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
}

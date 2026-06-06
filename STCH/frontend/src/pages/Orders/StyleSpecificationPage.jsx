import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Plus, Palette, Layers, ArrowRight, Shirt } from "lucide-react";

function StyleSpecificationPage() {
  const { id: poId } = useParams();
  const navigate = useNavigate();

  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ style_name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [poInfo, setPoInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [poId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stylesRes, poRes] = await Promise.all([
        API.get(`/styles/po/${poId}`),
        API.get(`/purchase-orders/${poId}`),
      ]);
      setStyles(stylesRes.data || []);
      setPoInfo(poRes.data);
    } catch (err) {
      console.error("Failed to load styles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.style_name.trim()) return;
    try {
      setSaving(true);
      await API.post(`/styles/po/${poId}`, form);
      setShowModal(false);
      setForm({ style_name: "", description: "" });
      await fetchData();
    } catch (err) {
      console.error("Failed to create style:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/orders/${poId}`)}
            className="text-zinc-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            ← Back to Order
          </button>
          <div className="text-zinc-500 text-xs font-mono">{poInfo?.po_number}</div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Style Specification</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Define styles, colors, and size breakdowns for this purchase order.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} />
            Add Style
          </button>
        </div>

        {/* Styles Grid */}
        {loading ? (
          <div className="text-zinc-500 text-sm py-20 text-center">Loading styles...</div>
        ) : styles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[#2A3142] rounded-[28px] text-center">
            <Shirt size={40} className="text-zinc-600 mb-4" />
            <p className="text-zinc-400 font-semibold text-lg">No styles defined yet</p>
            <p className="text-zinc-600 text-sm mt-1">Click "Add Style" to define the first style for this PO.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {styles.map((style) => (
              <div
                key={style.id}
                onClick={() => navigate(`/orders/${poId}/styles/${style.id}`)}
                className="group cursor-pointer rounded-[24px] border border-[#2A3142] bg-[#151821] p-6 space-y-4 hover:border-orange-500/40 hover:bg-[#1A1F2E] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                      {style.style_code}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-2">{style.style_name}</h3>
                    {style.description && (
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{style.description}</p>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-zinc-600 group-hover:text-orange-400 transition-all mt-1" />
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#2A3142]">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Palette size={13} className="text-purple-400" />
                    <span>{style.color_count} {style.color_count === 1 ? "Color" : "Colors"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Layers size={13} className="text-blue-400" />
                    <span>{style.total_quantity} Pcs Total</span>
                  </div>
                </div>

                {/* Color swatches preview */}
                {style.colors?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {style.colors.slice(0, 6).map((c) => (
                      <div
                        key={c.id}
                        title={c.color_name}
                        className="w-6 h-6 rounded-full border-2 border-[#2A3142] shadow"
                        style={{ backgroundColor: c.hex_value || "#444" }}
                      />
                    ))}
                    {style.colors.length > 6 && (
                      <div className="w-6 h-6 rounded-full border-2 border-[#2A3142] bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-400 font-bold">
                        +{style.colors.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Style Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] w-full max-w-md p-6 space-y-5 shadow-2xl text-white">
            <div>
              <h3 className="text-lg font-black tracking-tight">New Style</h3>
              <p className="text-xs text-zinc-400 mt-1">A unique style code will be auto-generated.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                  Style Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Straight Cut Pants"
                  value={form.style_name}
                  onChange={(e) => setForm((p) => ({ ...p, style_name: e.target.value }))}
                  required
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional — fabric, fit, construction notes..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm({ style_name: "", description: "" }); }}
                  className="px-4 py-2.5 text-xs font-semibold border border-[#2A3142] rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-black bg-orange-500 rounded-xl text-white hover:bg-orange-600 transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Style"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StyleSpecificationPage;

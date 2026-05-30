import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Plus, ChevronDown, ChevronRight, Palette, Edit2, Check, X,
  AlertTriangle, CheckCircle2, Clock, Calendar, User, Trash2
} from "lucide-react";

const STATUS_COLORS = {
  PENDING: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  IN_PROGRESS: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  COMPLETED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DELAYED: "text-red-400 bg-red-500/10 border-red-500/20",
  HOLD: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CANCELLED: "text-zinc-600 bg-zinc-700/10 border-zinc-700/20",
};

const PRIORITY_COLORS = {
  LOW: "text-zinc-400",
  MEDIUM: "text-blue-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400",
};

function StyleDetailPage() {
  const { id: poId, styleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPrivileged = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [style, setStyle] = useState(null);
  const [tnas, setTnas] = useState([]);
  const [internalUsers, setInternalUsers] = useState([]);
  const [industryColors, setIndustryColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedColors, setExpandedColors] = useState({});

  // Color modal
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorForm, setColorForm] = useState({ color_name: "", hex_value: "" });
  const [fabricImage, setFabricImage] = useState(null);
  const [savingColor, setSavingColor] = useState(false);

  // Size modal
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [activeSizeColorId, setActiveSizeColorId] = useState(null);
  const [sizeForm, setSizeForm] = useState({ size_value: "", quantity: "" });

  // TNA editing
  const [editingTnaId, setEditingTnaId] = useState(null);
  const [tnaEdit, setTnaEdit] = useState({});

  useEffect(() => {
    fetchAll();
  }, [styleId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [styleRes, tnaRes, colorsRes] = await Promise.all([
        API.get(`/styles/${styleId}`),
        API.get(`/styles/${styleId}/tna`),
        API.get(`/styles/industry-colors`),
      ]);
      setStyle(styleRes.data);
      setTnas(tnaRes.data || []);
      setIndustryColors(colorsRes.data || []);

      if (isPrivileged) {
        const usersRes = await API.get(`/styles/internal-users`);
        setInternalUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load style details:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColor = (colorId) =>
    setExpandedColors((p) => ({ ...p, [colorId]: !p[colorId] }));

  // ── Add Color ───────────────────────────────────────────────────────────
  const handleAddColor = async (e) => {
    e.preventDefault();
    try {
      setSavingColor(true);
      const fd = new FormData();
      fd.append("color_name", colorForm.color_name);
      if (colorForm.hex_value) fd.append("hex_value", colorForm.hex_value);
      if (fabricImage) fd.append("fabric_image", fabricImage);

      await API.post(`/styles/${styleId}/colors`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowColorModal(false);
      setColorForm({ color_name: "", hex_value: "" });
      setFabricImage(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to add color:", err);
    } finally {
      setSavingColor(false);
    }
  };

  // ── Add Size ────────────────────────────────────────────────────────────
  const handleAddSize = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/styles/colors/${activeSizeColorId}/sizes`, {
        size_value: sizeForm.size_value,
        quantity: parseInt(sizeForm.quantity),
      });
      setShowSizeModal(false);
      setSizeForm({ size_value: "", quantity: "" });
      await fetchAll();
    } catch (err) {
      console.error("Failed to add size:", err);
    }
  };

  const handleDeleteSize = async (sizeId) => {
    if (!window.confirm("Delete this size?")) return;
    try {
      await API.delete(`/styles/sizes/${sizeId}`);
      await fetchAll();
    } catch (err) {
      console.error("Failed to delete size:", err);
    }
  };

  // ── TNA Update ──────────────────────────────────────────────────────────
  const startEditTna = (tna) => {
    setEditingTnaId(tna.id);
    setTnaEdit({
      assigned_to: tna.assigned_to || "",
      priority: tna.priority || "MEDIUM",
      planned_date: tna.planned_date || "",
      actual_date: tna.actual_date || "",
      remarks: tna.remarks || "",
      delayed_reason: tna.delayed_reason || "",
    });
  };

  const saveTnaEdit = async (tnaId) => {
    try {
      await API.patch(`/tnas/${tnaId}`, {
        assigned_to: tnaEdit.assigned_to || null,
        priority: tnaEdit.priority || null,
        planned_date: tnaEdit.planned_date || null,
        actual_date: tnaEdit.actual_date || null,
        remarks: tnaEdit.remarks || null,
        delayed_reason: tnaEdit.delayed_reason || null,
      });
      setEditingTnaId(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to update TNA:", err);
    }
  };

  const updateTnaStatus = async (tnaId, status, delayed_reason) => {
    try {
      await API.patch(`/tnas/${tnaId}/status`, { status, delayed_reason });
      await fetchAll();
    } catch (err) {
      console.error("Failed to update TNA status:", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-zinc-500 text-sm py-20 text-center">Loading style details...</div>
      </DashboardLayout>
    );
  }

  if (!style) {
    return (
      <DashboardLayout>
        <div className="text-red-400 text-sm py-20 text-center">Style not found.</div>
      </DashboardLayout>
    );
  }

  const groupedColors = industryColors.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-16">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/orders/${poId}/styles`)}
            className="text-zinc-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            ← Back to Styles
          </button>
          <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-3 py-1 rounded-md border border-orange-500/20">
            {style.style_code}
          </span>
        </div>

        {/* Style Header */}
        <div className="rounded-[28px] border border-[#2A3142] bg-[#151821] p-7">
          <h1 className="text-3xl font-black text-white">{style.style_name}</h1>
          {style.description && (
            <p className="text-zinc-400 text-sm mt-2">{style.description}</p>
          )}
        </div>

        {/* ── Colors & Sizes Section ──────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Colors & Sizes</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Expand a color to manage its size breakdown.</p>
            </div>
            {isPrivileged && (
              <button
                onClick={() => setShowColorModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold rounded-xl border border-purple-500/20 transition-all"
              >
                <Plus size={13} /> Add Color
              </button>
            )}
          </div>

          {style.colors?.length === 0 ? (
            <div className="border border-dashed border-[#2A3142] rounded-[20px] p-10 text-center text-zinc-600 text-sm">
              No colors added yet. Click "Add Color" to start.
            </div>
          ) : (
            <div className="space-y-3">
              {style.colors.map((color) => (
                <div key={color.id} className="rounded-[20px] border border-[#2A3142] bg-[#151821] overflow-hidden">
                  {/* Color Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1A1F2E] transition-all"
                    onClick={() => toggleColor(color.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-[#2A3142] shadow flex-shrink-0"
                        style={{ backgroundColor: color.hex_value || "#555" }}
                      />
                      {color.fabric_image_path && (
                        <img
                          src={`http://localhost:5000${color.fabric_image_path}`}
                          alt="swatch"
                          className="w-8 h-8 rounded-lg object-cover border border-[#2A3142]"
                        />
                      )}
                      <div>
                        <p className="text-white font-bold text-sm">{color.color_name}</p>
                        <p className="text-zinc-500 text-[10px] font-mono">{color.color_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 text-xs">
                        {color.sizes?.length || 0} sizes · {" "}
                        {color.sizes?.reduce((sum, s) => sum + s.quantity, 0) || 0} pcs
                      </span>
                      {expandedColors[color.id] ? (
                        <ChevronDown size={16} className="text-zinc-500" />
                      ) : (
                        <ChevronRight size={16} className="text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Sizes Table */}
                  {expandedColors[color.id] && (
                    <div className="border-t border-[#2A3142] p-4 space-y-3 bg-[#0F141D]">
                      {color.sizes?.length === 0 ? (
                        <p className="text-zinc-600 text-xs text-center py-3">No sizes added yet.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-zinc-500 uppercase tracking-wider text-xs">
                              <th className="text-left pb-3">Size</th>
                              <th className="text-left pb-3">Code</th>
                              <th className="text-left pb-3">Quantity</th>
                              {isPrivileged && <th className="text-right pb-3">Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {color.sizes.map((s) => (
                              <tr key={s.id} className="border-t border-[#2A3142]/40">
                                <td className="py-2.5 text-white font-bold">{s.size_value}</td>
                                <td className="py-2.5 text-zinc-500 font-mono text-xs">{s.size_code}</td>
                                <td className="py-2.5 text-zinc-300">{s.quantity} pcs</td>
                                {isPrivileged && (
                                  <td className="py-2.5 text-right">
                                    <button
                                      onClick={() => handleDeleteSize(s.id)}
                                      className="text-zinc-600 hover:text-red-400 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-[#2A3142]">
                              <td colSpan={2} className="pt-2.5 text-zinc-500 text-xs uppercase font-bold">Total</td>
                              <td className="pt-2.5 text-orange-400 font-bold text-sm">
                                {color.sizes.reduce((s, r) => s + r.quantity, 0)} pcs
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      )}

                      {isPrivileged && (
                        <button
                          onClick={() => { setActiveSizeColorId(color.id); setShowSizeModal(true); }}
                          className="w-full py-2 rounded-xl border border-dashed border-[#2A3142] text-zinc-500 hover:text-white hover:border-zinc-500 text-xs transition-all flex items-center justify-center gap-1 mt-2"
                        >
                          <Plus size={11} /> Add Size
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TNA Timeline Section ──────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-white">TNA Timeline</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              {isPrivileged
                ? "Set planned dates, assign team members, and track milestone progress."
                : "Your assigned milestones for this style."}
            </p>
          </div>

          {tnas.length === 0 ? (
            <div className="border border-dashed border-[#2A3142] rounded-[20px] p-10 text-center text-zinc-600 text-sm">
              No TNA milestones found.
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#2A3142] bg-[#151821] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 uppercase tracking-wider text-xs border-b border-[#2A3142]">
                    <th className="text-left p-4">Milestone</th>
                    <th className="text-left p-4">Planned Date</th>
                    <th className="text-left p-4">Assigned To</th>
                    <th className="text-left p-4">Priority</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Delayed Reason</th>
                    {isPrivileged && <th className="text-right p-4">Edit</th>}
                  </tr>
                </thead>
                <tbody>
                  {tnas.map((tna) => {
                    const isEditing = editingTnaId === tna.id;
                    const canEdit = isPrivileged || tna.assigned_to === user?.id;

                    return (
                      <tr
                        key={tna.id}
                        className="border-b border-[#2A3142]/50 hover:bg-[#0F141D] transition-all"
                      >
                        {/* Milestone */}
                        <td className="p-4">
                          <span className="font-bold text-white text-sm">
                            {tna.activity_type.replaceAll("_", " ")}
                          </span>
                        </td>

                        {/* Planned Date */}
                        <td className="p-4">
                          {isEditing && isPrivileged ? (
                            <input
                              type="date"
                              value={tnaEdit.planned_date}
                              onChange={(e) => setTnaEdit((p) => ({ ...p, planned_date: e.target.value }))}
                              className="bg-[#0F141D] border border-[#2A3142] rounded-lg px-2 py-1 text-white font-mono text-xs outline-none focus:border-orange-500 w-36"
                            />
                          ) : (
                            <span className={`font-mono ${tna.planned_date ? "text-zinc-300" : "text-zinc-600 italic"}`}>
                              {tna.planned_date || "Not set"}
                            </span>
                          )}
                        </td>

                        {/* Assigned To */}
                        <td className="p-4">
                          {isEditing && isPrivileged ? (
                            <select
                              value={tnaEdit.assigned_to}
                              onChange={(e) => setTnaEdit((p) => ({ ...p, assigned_to: e.target.value }))}
                              className="bg-[#0F141D] border border-[#2A3142] rounded-lg px-2 py-1 text-zinc-200 text-xs outline-none focus:border-orange-500 w-40"
                            >
                              <option value="">Unassigned</option>
                              {internalUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name} ({u.role})
                                </option>
                              ))}
                            </select>
                          ) : tna.assigned_user ? (
                            <div className="flex items-center gap-1.5">
                              <User size={11} className="text-zinc-500" />
                              <span className="text-zinc-300">{tna.assigned_user.name}</span>
                              <span className="text-zinc-600 text-[10px]">· {tna.assigned_user.role}</span>
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="p-4">
                          {isEditing && isPrivileged ? (
                            <select
                              value={tnaEdit.priority}
                              onChange={(e) => setTnaEdit((p) => ({ ...p, priority: e.target.value }))}
                              className="bg-[#0F141D] border border-[#2A3142] rounded-lg px-2 py-1 text-zinc-200 text-xs outline-none focus:border-orange-500"
                            >
                              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`font-bold ${PRIORITY_COLORS[tna.priority] || "text-zinc-400"}`}>
                              {tna.priority}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <select
                            value={tna.status}
                            disabled={!canEdit}
                            onChange={(e) => updateTnaStatus(tna.id, e.target.value, tna.delayed_reason)}
                            className={`border rounded-lg px-2 py-1 text-xs font-bold outline-none cursor-pointer bg-transparent ${STATUS_COLORS[tna.status] || ""} ${!canEdit ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            {["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED", "HOLD", "CANCELLED"].map((s) => (
                              <option key={s} value={s} className="bg-[#151821] text-white">{s.replaceAll("_", " ")}</option>
                            ))}
                          </select>
                        </td>

                        {/* Delayed Reason */}
                        <td className="p-4 max-w-[180px]">
                          {isEditing ? (
                            <input
                              type="text"
                              placeholder="Reason for delay..."
                              value={tnaEdit.delayed_reason}
                              onChange={(e) => setTnaEdit((p) => ({ ...p, delayed_reason: e.target.value }))}
                              className="bg-[#0F141D] border border-[#2A3142] rounded-lg px-2 py-1 text-zinc-200 text-xs outline-none focus:border-orange-500 w-full"
                            />
                          ) : (
                            <span className={`text-xs ${tna.delayed_reason ? "text-red-400" : "text-zinc-600 italic"}`}>
                              {tna.delayed_reason || "—"}
                            </span>
                          )}
                        </td>

                        {/* Edit Actions */}
                        {isPrivileged && (
                          <td className="p-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => setEditingTnaId(null)}
                                  className="p-1 rounded-md border border-[#2A3142] text-zinc-400 hover:text-white"
                                >
                                  <X size={12} />
                                </button>
                                <button
                                  onClick={() => saveTnaEdit(tna.id)}
                                  className="p-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                                >
                                  <Check size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditTna(tna)}
                                className="p-1.5 rounded-lg border border-[#2A3142] text-zinc-500 hover:text-orange-400 hover:border-orange-500/30 transition-all"
                              >
                                <Edit2 size={12} />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Color Modal */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] w-full max-w-md p-6 space-y-5 shadow-2xl text-white">
            <div>
              <h3 className="text-lg font-black">Add Color</h3>
              <p className="text-xs text-zinc-400 mt-1">Select from industry colors or enter a custom hex. Optionally upload a fabric swatch.</p>
            </div>

            <form onSubmit={handleAddColor} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                  Color <span className="text-orange-400">*</span>
                </label>
                <select
                  value={colorForm.color_name}
                  onChange={(e) => {
                    const selected = industryColors.find((c) => c.name === e.target.value);
                    setColorForm((p) => ({
                      ...p,
                      color_name: e.target.value,
                      hex_value: selected?.hex || p.hex_value,
                    }));
                  }}
                  required
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500"
                >
                  <option value="">Select a color</option>
                  {Object.entries(
                    industryColors.reduce((acc, c) => {
                      if (!acc[c.category]) acc[c.category] = [];
                      acc[c.category].push(c);
                      return acc;
                    }, {})
                  ).map(([cat, colors]) => (
                    <optgroup key={cat} label={cat}>
                      {colors.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Hex Code</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={colorForm.hex_value || "#000000"}
                    onChange={(e) => setColorForm((p) => ({ ...p, hex_value: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-[#2A3142] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#RRGGBB"
                    value={colorForm.hex_value}
                    onChange={(e) => setColorForm((p) => ({ ...p, hex_value: e.target.value }))}
                    className="flex-1 bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">Fabric Swatch Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFabricImage(e.target.files[0])}
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-2.5 text-xs text-zinc-400 outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500/10 file:text-orange-400 file:text-xs file:font-semibold cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowColorModal(false); setColorForm({ color_name: "", hex_value: "" }); setFabricImage(null); }}
                  className="px-4 py-2.5 text-xs font-semibold border border-[#2A3142] rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingColor}
                  className="px-5 py-2.5 text-xs font-black bg-orange-500 rounded-xl text-white hover:bg-orange-600 transition-all shadow-md disabled:opacity-50"
                >
                  {savingColor ? "Adding..." : "Add Color"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151821] border border-[#2A3142] rounded-[28px] w-full max-w-sm p-6 space-y-5 shadow-2xl text-white">
            <div>
              <h3 className="text-lg font-black">Add Size</h3>
              <p className="text-xs text-zinc-400 mt-1">Enter a numeric size (e.g., 28, 30, 32) and quantity.</p>
            </div>

            <form onSubmit={handleAddSize} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                  Size Value <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 28, 30, 32..."
                  value={sizeForm.size_value}
                  onChange={(e) => setSizeForm((p) => ({ ...p, size_value: e.target.value }))}
                  required
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                  Quantity <span className="text-orange-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={sizeForm.quantity}
                  onChange={(e) => setSizeForm((p) => ({ ...p, quantity: e.target.value }))}
                  required
                  className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl p-3 text-sm text-zinc-200 outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowSizeModal(false); setSizeForm({ size_value: "", quantity: "" }); }}
                  className="px-4 py-2.5 text-xs font-semibold border border-[#2A3142] rounded-xl text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black bg-orange-500 rounded-xl text-white hover:bg-orange-600 transition-all shadow-md"
                >
                  Add Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default StyleDetailPage;

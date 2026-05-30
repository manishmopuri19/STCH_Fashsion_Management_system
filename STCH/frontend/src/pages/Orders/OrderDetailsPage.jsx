import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarDays,
  Shirt,
  Truck,
  Layers,
  Palette,
  ArrowRight,
  Plus,
} from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isPrivileged = user?.role === "ADMIN" || user?.role === "MERCHANDISER";

  const [order, setOrder] = useState(null);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderRes, stylesRes] = await Promise.all([
        API.get(`/purchase-orders/${id}`),
        API.get(`/styles/po/${id}`).catch(() => ({ data: [] })),
      ]);
      setOrder(orderRes.data);
      setStyles(stylesRes.data || []);
    } catch (err) {
      if (err?.response?.status === 403) {
        setUnauthorized(true);
        setError("You are not authorized to access this purchase order.");
      } else if (err?.response?.status === 404) {
        setError("Purchase order not found.");
      } else {
        setError("Failed to load purchase order.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePOStatus = async (status) => {
    try {
      await API.patch(`/purchase-orders/${id}/status`, { status });
      setOrder((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update PO status:", err);
    }
  };

  if (!loading && error) {
    return (
      <DashboardLayout>
        <EmptyState
          unauthorized={unauthorized}
          title={unauthorized ? "Unauthorized Access" : "Order Not Found"}
          description={error}
        />
      </DashboardLayout>
    );
  }

  const totalStyleQty = styles.reduce((sum, s) => sum + (s.total_quantity || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-8 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/orders")}
            className="text-zinc-400 hover:text-white transition-all text-sm font-medium flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center gap-3">
            {isPrivileged && (
              <button
                onClick={() => navigate(`/orders/${id}/styles`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#151821] hover:bg-[#1A1F2E] border border-[#2A3142] hover:border-orange-500/40 text-zinc-300 hover:text-orange-400 text-sm font-bold rounded-xl transition-all"
              >
                <Layers size={14} />
                Manage Styles & TNA
              </button>
            )}
            <div className="px-5 py-2 rounded-2xl bg-orange-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/10">
              {order?.status?.replaceAll("_", " ")}
            </div>
          </div>
        </div>

        {/* PO Hero — no financial data */}
        <div className="relative overflow-hidden rounded-[36px] border border-[#2A3142] bg-[#151821] p-8">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] pointer-events-none" />
          <div className="space-y-6">
            <div>
              <p className="text-zinc-500 uppercase tracking-[3px] text-xs font-semibold">Purchase Order</p>
              <h1 className="text-5xl font-black text-white mt-2 tracking-tight">{order?.po_number}</h1>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Pill icon={<Shirt size={15} />} text={order?.rfq?.garment_type} />
              <Pill icon={<Truck size={15} />} text={order?.lead_time ? `${order.lead_time} Days Lead` : null} />
              <Pill icon={<CalendarDays size={15} />} text={order?.delivery_date} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              <InfoCard label="Brand" value={order?.rfq?.brand} />
              <InfoCard label="Fabric Type" value={order?.rfq?.fabric_type} />
              <InfoCard label="Total Quantity" value={order?.quantity ? `${order.quantity} Pcs` : null} />
            </div>
          </div>
        </div>

        {/* Status bar — privileged users only */}
        {isPrivileged && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#151821] border border-[#2A3142] overflow-x-auto scrollbar-none">
            <span className="text-sm text-zinc-400 font-bold uppercase tracking-wider px-3 whitespace-nowrap">
              Order Status:
            </span>
            {["CREATED", "APPROVED", "IN_PRODUCTION", "SHIPPED", "DELIVERED"].map((status) => (
              <button
                key={status}
                onClick={() => updatePOStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all border whitespace-nowrap ${
                  order?.status === status
                    ? "bg-orange-500 text-white border-orange-600 shadow-md"
                    : "bg-[#0F141D] border-[#2A3142] text-zinc-400 hover:text-white hover:border-zinc-600"
                }`}
              >
                {status.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        )}

        {/* Styles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Styles</h2>
              <p className="text-sm text-zinc-500 mt-1">
                {styles.length > 0
                  ? `${styles.length} style${styles.length > 1 ? "s" : ""} · ${totalStyleQty} pcs across all styles`
                  : "No styles defined yet."}
              </p>
            </div>
            {isPrivileged && (
              <button
                onClick={() => navigate(`/orders/${id}/styles`)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-bold rounded-xl border border-orange-500/20 transition-all"
              >
                <Plus size={14} />
                Manage Styles
              </button>
            )}
          </div>

          {styles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[#2A3142] rounded-[28px] text-center">
              <Shirt size={36} className="text-zinc-700 mb-3" />
              <p className="text-zinc-500 font-semibold text-base">No styles added to this PO yet</p>
              <p className="text-zinc-600 text-sm mt-1 mb-4">
                {isPrivileged
                  ? "Define styles with colors, sizes, and TNA milestones."
                  : "The merchandiser hasn't added styles to this order yet."}
              </p>
              {isPrivileged && (
                <button
                  onClick={() => navigate(`/orders/${id}/styles`)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                >
                  <Plus size={14} /> Add First Style
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {styles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => navigate(`/orders/${id}/styles/${style.id}`)}
                  className="group cursor-pointer rounded-[22px] border border-[#2A3142] bg-[#151821] p-6 space-y-4 hover:border-orange-500/40 hover:bg-[#1A1F2E] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {style.style_code}
                      </span>
                      <h3 className="text-white font-bold text-lg mt-2 truncate">{style.style_name}</h3>
                      {style.description && (
                        <p className="text-zinc-500 text-sm mt-0.5 line-clamp-1">{style.description}</p>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-600 group-hover:text-orange-400 transition-all flex-shrink-0 mt-1 ml-2"
                    />
                  </div>

                  {/* Color swatches */}
                  {style.colors?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {style.colors.slice(0, 8).map((c) => (
                        <div
                          key={c.id}
                          title={c.color_name}
                          className="w-6 h-6 rounded-full border border-[#2A3142] shadow-sm"
                          style={{ backgroundColor: c.hex_value || "#555" }}
                        />
                      ))}
                      {style.colors.length > 8 && (
                        <div className="w-6 h-6 rounded-full border border-[#2A3142] bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-400 font-bold">
                          +{style.colors.length - 8}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-5 pt-2 border-t border-[#2A3142]">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Palette size={13} className="text-purple-400" />
                      {style.color_count} {style.color_count === 1 ? "Color" : "Colors"}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Layers size={13} className="text-blue-400" />
                      {style.total_quantity} Pcs
                    </div>
                  </div>
                </div>
              ))}

              {/* Add style ghost card — privileged only */}
              {isPrivileged && (
                <div
                  onClick={() => navigate(`/orders/${id}/styles`)}
                  className="cursor-pointer rounded-[22px] border border-dashed border-[#2A3142] bg-transparent p-6 flex flex-col items-center justify-center gap-2 hover:border-zinc-500 hover:bg-[#151821] transition-all min-h-[160px]"
                >
                  <Plus size={20} className="text-zinc-600" />
                  <span className="text-zinc-600 text-sm font-semibold">Add Style</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

function Pill({ icon, text }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F141D] border border-[#2A3142] text-sm text-zinc-300 font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-[#0F141D] border border-[#2A3142] rounded-2xl p-5">
      <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold block mb-1">{label}</span>
      <span className="text-white font-bold truncate text-base block">{value || "—"}</span>
    </div>
  );
}

export default OrderDetailPage;

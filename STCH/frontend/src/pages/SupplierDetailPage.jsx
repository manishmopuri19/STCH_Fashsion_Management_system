import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Factory,
  Mail,
  Phone,
  MapPin,
  Clock,
  Package,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const QUOTE_STATUS_COLORS = {
  MATCHED: "bg-blue-500/10 text-blue-400",
  QUOTED: "bg-yellow-500/10 text-yellow-400",
  ACCEPTED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

const PO_STATUS_COLORS = {
  CREATED: "bg-blue-500/10 text-blue-400",
  CONFIRMED: "bg-yellow-500/10 text-yellow-400",
  IN_PRODUCTION: "bg-orange-500/10 text-orange-400",
  SHIPPED: "bg-purple-500/10 text-purple-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rfqs");

  useEffect(() => {
    API.get(`/suppliers/${id}`)
      .then((r) => setSupplier(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="text-orange-500 animate-spin" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (!supplier) {
    return (
      <DashboardLayout>
        <div className="text-center text-zinc-500 py-20">Supplier not found.</div>
      </DashboardLayout>
    );
  }

  const rfqs = supplier.rfq_quotations || [];
  const pos  = supplier.purchase_orders || [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* BACK */}
        <button
          onClick={() => navigate("/suppliers")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Suppliers
        </button>

        {/* HEADER CARD */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Factory size={28} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-white">{supplier.company_name}</h1>
              <p className="text-zinc-400 mt-1 text-sm">{supplier.specialization || "Supplier"}</p>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard icon={Mail}    label="Email"      value={supplier.email} />
            <InfoCard icon={Phone}   label="Phone"      value={supplier.phone || "—"} />
            <InfoCard icon={MapPin}  label="Location"   value={[supplier.city, supplier.country].filter(Boolean).join(", ") || "—"} />
            <InfoCard icon={Clock}   label="Lead Time"  value={supplier.lead_time ? `${supplier.lead_time} days` : "—"} />
          </div>

          {/* SECONDARY ROW */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2A3142]">
            <InfoCard icon={Package} label="Min. Order Qty" value={supplier.minimum_order_quantity?.toLocaleString() || "—"} />
            {supplier.contact_person && (
              <div className="bg-[#1D2230] rounded-xl p-3 sm:col-span-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Contact Person</p>
                <p className="text-sm text-white">{supplier.contact_person}</p>
                {supplier.address && (
                  <p className="text-xs text-zinc-500 mt-1">{supplier.address}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "RFQ Quotations", value: rfqs.length },
            { label: "Purchase Orders", value: pos.length },
            {
              label: "Total PO Value",
              value: pos.length
                ? `${pos[0]?.currency || "INR"} ${pos.reduce((s, p) => s + (p.total_amount || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : "—",
            },
          ].map((s) => (
            <div key={s.label} className="bg-[#151821] border border-[#2A3142] rounded-2xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* TABS + TABLE */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-[#2A3142]">
            <TabBtn label="RFQ Quotations" count={rfqs.length} icon={FileText} active={activeTab === "rfqs"} onClick={() => setActiveTab("rfqs")} />
            <TabBtn label="Purchase Orders" count={pos.length}  icon={Package}  active={activeTab === "pos"}  onClick={() => setActiveTab("pos")}  />
          </div>

          {/* RFQ Quotations table */}
          {activeTab === "rfqs" && (
            rfqs.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3142] bg-[#1D2230]">
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">RFQ #</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand / Garment</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Qty</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Quoted Price</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Delivery</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3142]">
                  {rfqs.map((q) => (
                    <tr key={q.rfq_supplier_id} className="hover:bg-[#1D2230] transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-mono">{q.rfq_number}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{q.brand}</p>
                        <p className="text-xs text-zinc-500">{q.garment_type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{q.quantity?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {q.quoted_price ? `₹ ${q.quoted_price.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{q.delivery_date || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${QUOTE_STATUS_COLORS[q.quote_status] || "bg-zinc-500/10 text-zinc-500"}`}>
                          {q.quote_status || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => navigate(`/rfqs/${q.rfq_id}`)} className="text-zinc-500 hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="No RFQ quotations for this supplier yet." />
            )
          )}

          {/* Purchase Orders table */}
          {activeTab === "pos" && (
            pos.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2A3142] bg-[#1D2230]">
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">PO #</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Brand / Garment</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Qty</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Supplier Price</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Value</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Delivery</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3142]">
                  {pos.map((po) => (
                    <tr key={po.id} className="hover:bg-[#1D2230] transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-mono">{po.po_number}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{po.brand || "—"}</p>
                        <p className="text-xs text-zinc-500">{po.garment_type || po.rfq_number || ""}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{po.quantity?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {po.supplier_price ? `₹ ${po.supplier_price.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {po.total_amount ? `₹ ${po.total_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{po.delivery_date || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${PO_STATUS_COLORS[po.status] || "bg-zinc-500/10 text-zinc-500"}`}>
                          {po.status?.replace("_", " ") || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => navigate(`/orders/${po.id}`)} className="text-zinc-500 hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="No purchase orders for this supplier yet." />
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#1D2230] rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} className="text-blue-400" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

function TabBtn({ label, count, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-orange-500 text-white"
          : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <Icon size={15} />
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? "bg-orange-500/20 text-orange-400" : "bg-[#2A3142] text-zinc-500"}`}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({ message }) {
  return (
    <div className="px-6 py-14 text-center text-zinc-500 text-sm">{message}</div>
  );
}

export default SupplierDetailPage;

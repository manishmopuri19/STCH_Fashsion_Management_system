import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const STATUS_COLORS = {
  NEW: "bg-blue-500/10 text-blue-400",
  IN_PROGRESS: "bg-yellow-500/10 text-yellow-400",
  APPROVED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  COMPLETED: "bg-purple-500/10 text-purple-400",
};

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error("Failed to fetch customer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="text-orange-500 animate-spin" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center text-zinc-500 py-20">Customer not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* BACK */}
        <button
          onClick={() => navigate("/customers")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>

        {/* HEADER CARD */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={28} className="text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg font-semibold text-white">{customer.company_name}</h1>
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    customer.is_active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-500/10 text-zinc-500"
                  }`}
                >
                  {customer.is_active ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {customer.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-zinc-400 mt-1">{customer.contact_person}</p>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoItem icon={Mail} label="Email" value={customer.email} />
            <InfoItem icon={Phone} label="Phone" value={customer.phone || "—"} />
            <InfoItem icon={MapPin} label="Country" value={customer.country || "—"} />
            <InfoItem icon={DollarSign} label="Currency" value={customer.currency || "USD"} />
          </div>

          {(customer.address || customer.payment_terms || customer.notes) && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2A3142]">
              {customer.address && (
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-sm text-zinc-300">{customer.address}</p>
                </div>
              )}
              {customer.payment_terms && (
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Payment Terms</p>
                  <p className="text-sm text-zinc-300">{customer.payment_terms}</p>
                </div>
              )}
              {customer.notes && (
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Notes</p>
                  <p className="text-sm text-zinc-300">{customer.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ORDERS */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#2A3142] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-orange-400" />
              <h2 className="text-white font-semibold">Orders / RFQs</h2>
            </div>
            <span className="text-xs text-zinc-500">{customer.rfqs?.length || 0} total</span>
          </div>

          {customer.rfqs?.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A3142] bg-[#1D2230]">
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">RFQ #</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Garment</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Qty</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Delivery</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">PO</th>
                  <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3142]">
                {customer.rfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-[#1D2230] transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">{rfq.rfq_number}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{rfq.garment_type}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {rfq.quantity?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{rfq.delivery_date || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          STATUS_COLORS[rfq.status] || "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {rfq.status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {rfq.po_number ? (
                        <button
                          onClick={() => navigate(`/orders/${rfq.po_id}`)}
                          className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-mono"
                        >
                          {rfq.po_number}
                          <ExternalLink size={12} />
                        </button>
                      ) : (
                        <span className="text-zinc-600">No PO</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/rfqs/${rfq.id}`)}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center text-zinc-500 text-sm">
              No RFQs linked to this customer yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#1D2230] rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} className="text-orange-400" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

export default CustomerDetailPage;

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { UserPlus, Trash2, X, Loader2, Pencil, Search, ChevronRight, Building2 } from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

const EMPTY_FORM = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  currency: "USD",
  payment_terms: "",
  notes: "",
};

const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(q) ||
        c.contact_person?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const openCreate = () => {
    setIsEditMode(false);
    setEditingCustomer(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (customer) => {
    setIsEditMode(true);
    setEditingCustomer(customer);
    setForm({
      company_name:  customer.company_name  || "",
      contact_person:customer.contact_person|| "",
      email:         customer.email         || "",
      phone:         customer.phone         || "",
      country:       customer.country       || "",
      address:       customer.address       || "",
      currency:      customer.currency      || "USD",
      payment_terms: customer.payment_terms || "",
      notes:         customer.notes         || "",
      is_active:     customer.is_active     ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingCustomer(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        const res = await API.patch(`/customers/${editingCustomer.id}`, form);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...res.data.customer } : c))
        );
      } else {
        await API.post("/customers", form);
        await fetchCustomers();
      }
      closeModal();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await API.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const setField = (field) => (value) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-white">Customers</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Track your buyers and their orders</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-sm font-medium"
          >
            <UserPlus size={16} />
            Add Customer
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: customers.length },
            { label: "Active", value: customers.filter((c) => c.is_active).length },
            { label: "Total Orders", value: customers.reduce((s, c) => s + (c.rfq_count || 0), 0) },
            { label: "Countries", value: new Set(customers.map((c) => c.country).filter(Boolean)).size },
          ].map((s) => (
            <div key={s.label} className="bg-[#151821] border border-[#2A3142] rounded-2xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search company, contact, email, country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#151821] border border-[#2A3142] text-white text-sm outline-none focus:border-orange-500 placeholder-zinc-600 transition-colors"
          />
        </div>

        {/* TABLE */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="text-orange-500 animate-spin" size={28} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A3142] bg-[#1D2230]">
                  {["Company", "Contact", "Email", "Country", "Orders", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3142]">
                {filtered.length > 0 ? filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="hover:bg-[#1D2230] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <Building2 size={13} className="text-orange-400" />
                        </div>
                        <span className="text-sm text-white font-medium">{c.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-400">{c.contact_person}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-400">{c.email}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-400">{c.country || "—"}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                        {c.rfq_count || 0} RFQs
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-500"
                      }`}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={14} />
                        </button>
                        <ChevronRight size={14} className="text-zinc-700 ml-1" />
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-14 text-center text-zinc-500 text-sm">
                      {search ? "No customers match your search." : "No customers yet. Add your first one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL — rendered in document.body via portal to escape transform stacking context */}
      {isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="bg-[#151821] border border-[#2A3142] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col"
            style={{ maxHeight: "90vh", animation: "modal-enter 0.2s ease-out forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A3142] flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {isEditMode ? "Edit Customer" : "Add New Customer"}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isEditMode ? "Update customer details" : "Fill in the details below"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form — scrollable */}
            <form id="customer-form" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

              <Field label="Company Name" required>
                <Input value={form.company_name} onChange={setField("company_name")} placeholder="e.g. Zara, H&M" required />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact Person" required>
                  <Input value={form.contact_person} onChange={setField("contact_person")} placeholder="Full name" required />
                </Field>
                <Field label="Email" required>
                  <Input type="email" value={form.email} onChange={setField("email")} placeholder="contact@brand.com" required />
                </Field>
                <Field label="Phone">
                  <Input value={form.phone} onChange={setField("phone")} placeholder="+1 234 567 890" />
                </Field>
                <Field label="Country">
                  <Input value={form.country} onChange={setField("country")} placeholder="e.g. United States" />
                </Field>
                <Field label="Currency">
                  <Input value={form.currency} onChange={setField("currency")} placeholder="USD" />
                </Field>
                <Field label="Payment Terms">
                  <Input value={form.payment_terms} onChange={setField("payment_terms")} placeholder="e.g. Net 30" />
                </Field>
              </div>

              <Field label="Address">
                <Input value={form.address} onChange={setField("address")} placeholder="Street, City, ZIP" />
              </Field>

              <Field label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => setField("notes")(e.target.value)}
                  placeholder="Any additional notes…"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#2A3142] bg-[#0F141D] text-white text-sm outline-none focus:border-orange-500 resize-none placeholder-zinc-600 transition-colors"
                />
              </Field>

              {isEditMode && (
                <div className="flex items-center gap-3 py-1">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Active</span>
                  <button
                    type="button"
                    onClick={() => setField("is_active")(!form.is_active)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                      form.is_active ? "bg-orange-500" : "bg-[#2A3142]"
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      form.is_active ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              )}

            </form>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#2A3142] flex-shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-[#2A3142] text-zinc-400 text-sm font-medium hover:bg-[#1D2230] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="customer-form"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {isEditMode ? "Save Changes" : "Add Customer"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
};

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 rounded-xl border border-[#2A3142] bg-[#0F141D] text-white text-sm outline-none focus:border-orange-500 placeholder-zinc-600 transition-colors"
    />
  );
}

export default CustomersPage;

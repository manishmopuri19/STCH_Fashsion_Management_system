import { useState, useEffect } from "react";
import { Plus, X, Loader2, Building2, ChevronDown } from "lucide-react";
import API from "../../../api/axios";
import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { FormField, RFQSelect } from "../ui/RFQInputs";

const EMPTY_CUSTOMER = {
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  country: "",
};

function BrandInfoStep({ formData, setFormData, errors }) {
  const update = (field, val) => setFormData({ ...formData, [field]: val });

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState(EMPTY_CUSTOMER);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    API.get("/customers")
      .then((r) => setCustomers(r.data))
      .catch(() => {})
      .finally(() => setLoadingCustomers(false));
  }, []);

  const selectedCustomer = customers.find((c) => c.id === formData.customerId) || null;

  const selectCustomer = (customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      brand: customer.company_name,
    });
    setDropdownOpen(false);
  };

  const clearCustomer = () => {
    setFormData({ ...formData, customerId: null, brand: "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCustomer.company_name.trim()) {
      setCreateError("Company name is required");
      return;
    }
    if (!newCustomer.email.trim()) {
      setCreateError("Email is required");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await API.post("/customers", newCustomer);
      // Fetch the newly created customer by id to get full data
      const detail = await API.get(`/customers/${res.data.customer_id}`);
      const created = { ...detail.data, rfq_count: 0 };
      setCustomers((prev) => [...prev, created]);
      selectCustomer(created);
      setShowCreateModal(false);
      setNewCustomer(EMPTY_CUSTOMER);
    } catch (err) {
      setCreateError(err.response?.data?.detail || "Failed to create customer");
    } finally {
      setCreating(false);
    }
  };

  const set = (field) => (e) =>
    setNewCustomer((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Brand & Basic Information</h2>
        <p className="text-zinc-500 mt-1 text-sm">Select the customer/brand and provide basic RFQ details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Customer / Brand picker ── */}
        <FormField label="Customer / Brand *" error={errors.brand} className="md:col-span-2">
          {selectedCustomer ? (
            /* Selected state */
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0F141D] border border-orange-500/50 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Building2 size={13} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{selectedCustomer.company_name}</p>
                <p className="text-xs text-zinc-500 truncate">{selectedCustomer.email}</p>
              </div>
              <button
                type="button"
                onClick={clearCustomer}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            /* Dropdown trigger */
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-2.5 bg-[#0F141D] border rounded-xl text-sm transition-colors duration-150 ${
                  errors.brand ? "border-red-500" : "border-[#2A3142] hover:border-zinc-500"
                } focus:outline-none`}
              >
                <span className="text-zinc-600">
                  {loadingCustomers ? "Loading customers…" : "Select or create a customer"}
                </span>
                {loadingCustomers
                  ? <Loader2 size={14} className="text-zinc-500 animate-spin" />
                  : <ChevronDown size={14} className="text-zinc-500" />
                }
              </button>

              {dropdownOpen && (
                <div className="dropdown-enter absolute left-0 right-0 top-[calc(100%+6px)] bg-[#151821] border border-[#2A3142] rounded-2xl shadow-2xl z-40 overflow-hidden">
                  {/* Existing customers */}
                  <div className="max-h-52 overflow-y-auto">
                    {customers.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-zinc-500">No customers yet.</p>
                    ) : (
                      customers.filter((c) => c.is_active).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectCustomer(c)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1D2230] transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Building2 size={13} className="text-orange-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{c.company_name}</p>
                            <p className="text-xs text-zinc-500 truncate">{c.country || c.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Create new */}
                  <div className="border-t border-[#2A3142]">
                    <button
                      type="button"
                      onClick={() => { setDropdownOpen(false); setShowCreateModal(true); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-orange-400 hover:bg-[#1D2230] transition-colors font-medium"
                    >
                      <Plus size={15} />
                      Create new customer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </FormField>

        {/* Season */}
        <FormField label="Season *" error={errors.season}>
          <RFQSelect
            options={RFQ_OPTIONS.seasons}
            value={formData.season}
            onChange={(v) => update("season", v)}
            placeholder="Select season"
            className={errors.season ? "border-red-500" : ""}
          />
        </FormField>

        {/* Department */}
        <FormField label="Department *" error={errors.department}>
          <RFQSelect
            options={RFQ_OPTIONS.departments}
            value={formData.department}
            onChange={(v) => update("department", v)}
            placeholder="Select department"
            className={errors.department ? "border-red-500" : ""}
          />
        </FormField>

        {/* Category */}
        <FormField label="Category" error={errors.category}>
          <RFQSelect
            options={RFQ_OPTIONS.categories}
            value={formData.category}
            onChange={(v) => update("category", v)}
            placeholder="Select category"
          />
        </FormField>

        {/* Sub-Category */}
        <FormField label="Sub-Category">
          <input
            type="text"
            value={formData.subCategory ?? ""}
            onChange={(e) => update("subCategory", e.target.value)}
            placeholder="e.g. Casual, Formal, Street"
            className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors duration-150"
          />
        </FormField>

        {/* Priority */}
        <FormField label="Order Priority *" error={errors.priority}>
          <RFQSelect
            options={RFQ_OPTIONS.priorities}
            value={formData.priority}
            onChange={(v) => update("priority", v)}
            placeholder="Select priority"
            className={errors.priority ? "border-red-500" : ""}
          />
        </FormField>
      </div>

      {/* ── Create Customer Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-[#2A3142] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">New Customer</h3>
              <button
                type="button"
                onClick={() => { setShowCreateModal(false); setCreateError(""); }}
                className="text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3">
              {createError && (
                <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{createError}</p>
              )}
              <MiniInput label="Company Name *" value={newCustomer.company_name} onChange={set("company_name")} placeholder="e.g. Zara, H&M" />
              <MiniInput label="Contact Person *" value={newCustomer.contact_person} onChange={set("contact_person")} placeholder="Full name" />
              <MiniInput label="Email *" type="email" value={newCustomer.email} onChange={set("email")} placeholder="contact@brand.com" />
              <div className="grid grid-cols-2 gap-3">
                <MiniInput label="Phone" value={newCustomer.phone} onChange={set("phone")} placeholder="+1 234 567" />
                <MiniInput label="Country" value={newCustomer.country} onChange={set("country")} placeholder="e.g. USA" />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setCreateError(""); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#2A3142] text-zinc-400 text-sm font-medium hover:bg-[#1D2230]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  {creating ? "Creating…" : "Create & Select"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0F141D] border border-[#2A3142] rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
}

export default BrandInfoStep;

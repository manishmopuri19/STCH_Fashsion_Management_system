import { X, Loader2 } from "lucide-react";

const GARMENT_TYPES = [
  "T-Shirt", "Polo Shirt", "Shirt", "Hoodie", "Sweatshirt",
  "Jacket", "Denim Jeans", "Trousers", "Shorts", "Dress",
  "Skirt", "Activewear Top", "Activewear Bottom", "Sweater",
];

const CATEGORIES = [
  "Knit", "Woven", "Denim", "Activewear",
  "Outerwear", "Innerwear", "Accessories",
];

const FABRIC_TYPES = [
  "100% Cotton", "100% Polyester", "Cotton-Polyester Blend",
  "Rayon", "Linen", "Nylon", "Bamboo", "Modal", "Spandex Blend",
  "Fleece", "French Terry", "Pique",
];

const WASH_TYPES = [
  "No Wash", "Softener Wash", "Enzyme Wash", "Stone Wash",
  "Acid Wash", "Garment Dye", "Pigment Dye", "Bleach Wash",
];

// Reusable field wrapper used by every form row below
function FormField({ label, name, value, onChange, type = "text", options, required, placeholder }) {
  const inputClass =
    "w-full bg-[#151821] border border-[#2A3142] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600";

  return (
    <div>
      <label className="block text-zinc-400 text-xs font-medium mb-1.5">
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>

      {options ? (
        <select name={name} value={value} onChange={onChange} className={inputClass}>
          <option value="">Select {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={inputClass}
          min={type === "number" ? 0 : undefined}
          step={name === "target_price" ? "0.01" : undefined}
        />
      )}
    </div>
  );
}

function CatalogueFormModal({ open, onClose, formData, onChange, onSubmit, submitting, editItem }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#11151D] border border-[#2A3142] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* STICKY HEADER */}
        <div className="sticky top-0 bg-[#11151D] px-6 py-5 border-b border-[#2A3142] flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-white font-bold text-xl">
              {editItem ? "Edit Catalogue Item" : "Add New Catalogue Item"}
            </h2>
            <p className="text-zinc-500 text-sm mt-0.5">Fill in the garment details</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* IMAGE URL PREVIEW */}
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Image URL</label>
            <input
              name="image_url"
              value={formData.image_url}
              onChange={onChange}
              placeholder="https://example.com/garment.jpg"
              className="w-full bg-[#151821] border border-[#2A3142] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
            />
            {formData.image_url && (
              <div className="mt-2 h-28 rounded-xl overflow-hidden bg-[#1D2230] border border-[#2A3142]">
                <img
                  src={formData.image_url}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          {/* NAME + CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Name" name="product_name" value={formData.product_name} onChange={onChange} required placeholder="e.g. Classic Crew Tee" />
            <FormField label="Category" name="category" value={formData.category} onChange={onChange} options={CATEGORIES} required />
          </div>

          {/* GARMENT TYPE + FABRIC TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Garment Type" name="garment_type" value={formData.garment_type} onChange={onChange} options={GARMENT_TYPES} required />
            <FormField label="Fabric Type" name="fabric_type" value={formData.fabric_type} onChange={onChange} options={FABRIC_TYPES} required />
          </div>

          {/* FABRIC COMPOSITION + GSM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Fabric Composition" name="fabric_composition" value={formData.fabric_composition} onChange={onChange} placeholder="e.g. 80% Cotton, 20% Polyester" />
            <FormField label="GSM" name="gsm" value={formData.gsm} onChange={onChange} placeholder="e.g. 180" />
          </div>

          {/* WASH TYPE + PRINT TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Wash Type" name="wash_type" value={formData.wash_type} onChange={onChange} options={WASH_TYPES} />
            <FormField label="Print Type" name="print_type" value={formData.print_type} onChange={onChange} placeholder="e.g. Screen Print, DTG" />
          </div>

          {/* MOQ / PRICE / LEAD TIME */}
          <div className="grid grid-cols-3 gap-4">
            <FormField label="MOQ (units)" name="moq" value={formData.moq} onChange={onChange} type="number" placeholder="500" required />
            <FormField label="Target Price (₹)" name="target_price" value={formData.target_price} onChange={onChange} type="number" placeholder="12.50" required />
            <FormField label="Lead Time (days)" name="lead_time" value={formData.lead_time} onChange={onChange} type="number" placeholder="30" required />
          </div>

          {/* EMBROIDERY */}
          <FormField label="Embroidery Type" name="embroidery_type" value={formData.embroidery_type} onChange={onChange} placeholder="e.g. Flat, 3D Puff, Chenille" />

          {/* DESCRIPTION */}
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              placeholder="Describe this garment — construction, special finishes, target market..."
              className="w-full bg-[#151821] border border-[#2A3142] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder-zinc-600"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#2A3142] text-zinc-400 hover:text-white hover:bg-[#1D2230] transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editItem ? "Update Item" : "Add to Catalogue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogueFormModal;

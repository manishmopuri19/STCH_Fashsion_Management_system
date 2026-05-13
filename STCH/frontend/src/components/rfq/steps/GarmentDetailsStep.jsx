// src/components/rfq/steps/GarmentDetailsStep.jsx

const garmentTypes = ["T-Shirt", "Polo", "Shirt", "Hoodie", "Jeans", "Jacket"];
const fabricTypes = ["Cotton", "Polyester", "Denim", "Linen", "Fleece", "Jersey"];

function GarmentDetailsStep({ formData, setFormData, errors }) {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-semibold text-white">Garment Details</h2>
      <p className="text-zinc-400 mt-2 mb-8">Specify fabric and garment specifications for production.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <SelectField
          label="Garment Type"
          value={formData.garmentType}
          onChange={(val) => setFormData({ ...formData, garmentType: val })}
          options={garmentTypes}
          error={errors.garmentType}
        />
        <SelectField
          label="Fabric Type"
          value={formData.fabricType}
          onChange={(val) => setFormData({ ...formData, fabricType: val })}
          options={fabricTypes}
          error={errors.fabricType}
        />
        <InputField
          label="Fabric Weight (GSM)"
          placeholder="e.g. 180"
          value={formData.fabricWeight}
          onChange={(val) => setFormData({ ...formData, fabricWeight: val })}
        />
        <InputField
          label="Fabric Composition"
          placeholder="e.g. 100% Cotton"
          value={formData.fabricComposition}
          onChange={(val) => setFormData({ ...formData, fabricComposition: val })}
        />
        <InputField
          label="Construction"
          placeholder="e.g. Single Jersey"
          value={formData.construction}
          onChange={(val) => setFormData({ ...formData, construction: val })}
        />
        <InputField
          label="Yarn Count"
          placeholder="e.g. 30s"
          value={formData.yarnCount}
          onChange={(val) => setFormData({ ...formData, yarnCount: val })}
        />
      </div>
    </div>
  );
}

// Unified Input Component
function InputField({ label, value, onChange, placeholder, error }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-zinc-300">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3.5 rounded-xl border bg-[#0F141D] text-white outline-none transition-all focus:border-orange-500 ${
          error ? "border-red-500" : "border-[#2A3142]"
        }`}
      />
    </div>
  );
}

// Unified Select Component
function SelectField({ label, value, onChange, options, error }) {
  return (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-medium text-zinc-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3.5 rounded-xl border bg-[#0F141D] text-white outline-none appearance-none transition-all focus:border-orange-500 ${
          error ? "border-red-500" : "border-[#2A3142]"
        }`}
      >
        <option value="" className="bg-[#151821]">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#151821]">{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default GarmentDetailsStep;
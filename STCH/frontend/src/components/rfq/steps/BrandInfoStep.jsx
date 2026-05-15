import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { FormField, RFQInput, RFQSelect } from "../ui/RFQInputs";

/**
 * Step 1 – Brand & Basic Information
 * Fields: Brand, Season, Department, Category, Sub-Category, Priority
 */
function BrandInfoStep({ formData, setFormData, errors }) {
  const update = (field, val) => setFormData({ ...formData, [field]: val });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Brand & Basic Information</h2>
        <p className="text-zinc-500 mt-1 text-sm">Select the brand and provide basic RFQ details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Brand name – free text */}
        <FormField label="Brand *" error={errors.brand}>
          <RFQInput
            value={formData.brand}
            onChange={(v) => update("brand", v)}
            placeholder="e.g. Max Fashion"
            className={errors.brand ? "border-red-500" : ""}
          />
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

        {/* Sub-Category – free text */}
        <FormField label="Sub-Category">
          <RFQInput
            value={formData.subCategory}
            onChange={(v) => update("subCategory", v)}
            placeholder="e.g. Casual, Formal, Street"
          />
        </FormField>

        {/* Order Priority */}
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
    </div>
  );
}

export default BrandInfoStep;
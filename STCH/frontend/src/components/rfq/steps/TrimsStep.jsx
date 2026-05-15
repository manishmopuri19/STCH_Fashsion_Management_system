import { FormField, RFQInput, RFQTextArea } from "../ui/RFQInputs";

/**
 * Step 4 – Trims & Accessories
 * Fields: Trims Details (textarea), Packaging Type, Label Type
 */
function TrimsStep({ formData, setFormData, errors }) {
  const update = (field, value) => setFormData({ ...formData, [field]: value });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Trims & Accessories</h2>
        <p className="text-zinc-500 mt-1 text-sm">Buttons, zippers, labels, and packaging details.</p>
      </div>

      {/* Trims Details – full width textarea */}
      <FormField label="Trims Details *" error={errors.trimsDetails}>
        <RFQTextArea
          value={formData.trimsDetails}
          onChange={(v) => update("trimsDetails", v)}
          placeholder="Describe trims requirements: buttons, zippers, drawcords, rivets, etc."
          rows={5}
          className={errors.trimsDetails ? "border-red-500" : ""}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Packaging Type */}
        <FormField label="Packaging Type *" error={errors.packagingType}>
          <RFQInput
            value={formData.packagingType}
            onChange={(v) => update("packagingType", v)}
            placeholder="e.g. Poly bag, Hanger, Flat pack"
            className={errors.packagingType ? "border-red-500" : ""}
          />
        </FormField>

        {/* Label Type */}
        <FormField label="Label Type *" error={errors.labelType}>
          <RFQInput
            value={formData.labelType}
            onChange={(v) => update("labelType", v)}
            placeholder="e.g. Woven, Printed, Heat transfer"
            className={errors.labelType ? "border-red-500" : ""}
          />
        </FormField>
      </div>
    </div>
  );
}

export default TrimsStep;
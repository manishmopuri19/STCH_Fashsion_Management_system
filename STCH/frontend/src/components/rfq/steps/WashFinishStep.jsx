import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { ChipGroup, FormField, RFQInput } from "../ui/RFQInputs";

/**
 * Step 5 – Wash & Finish
 * Fields: Garment Wash (chips), Dye Type, Print Type,
 *         Embroidery Type, Special Finish
 */
function WashFinishStep({ formData, setFormData, errors }) {
  const update = (field, val) => setFormData({ ...formData, [field]: val });

  const toggleWash = (val) => {
    const list = formData.garmentWash.includes(val)
      ? formData.garmentWash.filter((i) => i !== val)
      : [...formData.garmentWash, val];
    update("garmentWash", list);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Wash & Finish</h2>
        <p className="text-zinc-500 mt-1 text-sm">
          Wash, dye, print, and embroidery specifications.
        </p>
      </div>

      {/* Garment Wash chips */}
      <div>
        <p className="text-sm font-medium text-zinc-400 mb-1">Garment Wash *</p>
        {errors.garmentWash && (
          <p className="text-xs text-red-400 mb-2">{errors.garmentWash}</p>
        )}
        <ChipGroup
          options={RFQ_OPTIONS.washOptions}
          selected={formData.garmentWash}
          onToggle={toggleWash}
          variant="outline"
        />
      </div>

      {/* Additional finish fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Dye Type">
          <RFQInput
            value={formData.dyeType}
            onChange={(v) => update("dyeType", v)}
            placeholder="e.g. Reactive, Pigment, Vat"
          />
        </FormField>

        <FormField label="Print Type">
          <RFQInput
            value={formData.printType}
            onChange={(v) => update("printType", v)}
            placeholder="e.g. Screen, Digital, Sublimation"
          />
        </FormField>

        <FormField label="Embroidery Type">
          <RFQInput
            value={formData.embroideryType}
            onChange={(v) => update("embroideryType", v)}
            placeholder="e.g. Flat, 3D, Applique"
          />
        </FormField>

        <FormField label="Special Finish">
          <RFQInput
            value={formData.specialFinish}
            onChange={(v) => update("specialFinish", v)}
            placeholder="e.g. Silicone softener, Anti-pilling"
          />
        </FormField>
      </div>
    </div>
  );
}

export default WashFinishStep;
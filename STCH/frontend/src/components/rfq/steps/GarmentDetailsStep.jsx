import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { FormField, RFQInput, RFQSelect } from "../ui/RFQInputs";

/**
 * Step 2 – Garment Details
 * Fields: Garment Type, Fabric Type, Fabric Weight (GSM), Fabric Composition,
 *         Construction, Yarn Count
 */
function GarmentDetailsStep({ formData, setFormData, errors }) {
  const update = (f, v) => setFormData({ ...formData, [f]: v });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Garment Details</h2>
        <p className="text-zinc-500 mt-1 text-sm">Specify fabric and garment specifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Garment Type */}
        <FormField label="Garment Type *" error={errors.garmentType}>
          <RFQSelect
            options={RFQ_OPTIONS.garmentTypes}
            value={formData.garmentType}
            onChange={(v) => update("garmentType", v)}
            placeholder="Select garment type"
            className={errors.garmentType ? "border-red-500" : ""}
          />
        </FormField>

        {/* Fabric Type */}
        <FormField label="Fabric Type *" error={errors.fabricType}>
          <RFQSelect
            options={RFQ_OPTIONS.fabricTypes}
            value={formData.fabricType}
            onChange={(v) => update("fabricType", v)}
            placeholder="Select fabric type"
            className={errors.fabricType ? "border-red-500" : ""}
          />
        </FormField>

        {/* Fabric Weight (GSM) */}
        <FormField label="Fabric Weight (GSM) *" error={errors.fabricWeight}>
          <RFQInput
            type="number"
            value={formData.fabricWeight}
            onChange={(v) => update("fabricWeight", v)}
            placeholder="e.g. 180"
            className={errors.fabricWeight ? "border-red-500" : ""}
          />
        </FormField>

        {/* Fabric Composition */}
        <FormField label="Fabric Composition *" error={errors.fabricComposition}>
          <RFQInput
            value={formData.fabricComposition}
            onChange={(v) => update("fabricComposition", v)}
            placeholder="e.g. 100% Cotton, 60/40 Cotton-Poly"
            className={errors.fabricComposition ? "border-red-500" : ""}
          />
        </FormField>

        {/* Construction */}
        <FormField label="Construction" error={errors.construction}>
          <RFQInput
            value={formData.construction}
            onChange={(v) => update("construction", v)}
            placeholder="e.g. Single Jersey, Twill 3/1"
          />
        </FormField>

        {/* Yarn Count */}
        <FormField label="Yarn Count" error={errors.yarnCount}>
          <RFQInput
            value={formData.yarnCount}
            onChange={(v) => update("yarnCount", v)}
            placeholder="e.g. 30s, 40s Combed"
          />
        </FormField>
      </div>
    </div>
  );
}

export default GarmentDetailsStep;
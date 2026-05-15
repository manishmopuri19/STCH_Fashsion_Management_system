import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { ChipGroup, FormField, RFQInput } from "../ui/RFQInputs";

/**
 * Step 6 – Compliance & Standards
 * Fields: Compliance Standards (chips), Testing Required (chips),
 *         Social Compliance, Quality Standards
 */
function ComplianceStep({ formData, setFormData, errors }) {
  const update = (field, val) => setFormData({ ...formData, [field]: val });

  const toggleStandard = (std) => {
    const exists = formData.complianceStandards.includes(std);
    update(
      "complianceStandards",
      exists
        ? formData.complianceStandards.filter((i) => i !== std)
        : [...formData.complianceStandards, std]
    );
  };

  const toggleTest = (test) => {
    const exists = formData.testingRequired.includes(test);
    update(
      "testingRequired",
      exists
        ? formData.testingRequired.filter((i) => i !== test)
        : [...formData.testingRequired, test]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Compliance & Standards</h2>
        <p className="text-zinc-500 mt-1 text-sm">Certifications and quality requirements.</p>
      </div>

      {/* Compliance Standards */}
      <div>
        <p className="text-sm font-medium text-zinc-400 mb-1">Compliance Standards *</p>
        {errors.complianceStandards && (
          <p className="text-xs text-red-400 mb-2">{errors.complianceStandards}</p>
        )}
        <ChipGroup
          options={RFQ_OPTIONS.compliance}
          selected={formData.complianceStandards}
          onToggle={toggleStandard}
          variant="solid"
        />
      </div>

      {/* Testing Required */}
      <div>
        <p className="text-sm font-medium text-zinc-400 mb-1">Testing Required *</p>
        {errors.testingRequired && (
          <p className="text-xs text-red-400 mb-2">{errors.testingRequired}</p>
        )}
        <ChipGroup
          options={RFQ_OPTIONS.testingRequired}
          selected={formData.testingRequired}
          onToggle={toggleTest}
          variant="solid"
        />
      </div>

      {/* Social Compliance + Quality Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Social Compliance">
          <RFQInput
            value={formData.socialCompliance}
            onChange={(v) => update("socialCompliance", v)}
            placeholder="e.g. BSCI, WRAP, SA8000"
          />
        </FormField>

        <FormField label="Quality Standards">
          <RFQInput
            value={formData.qualityStandards}
            onChange={(v) => update("qualityStandards", v)}
            placeholder="e.g. AQL 2.5, Zero defect"
          />
        </FormField>
      </div>
    </div>
  );
}

export default ComplianceStep;
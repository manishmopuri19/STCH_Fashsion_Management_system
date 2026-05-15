import { FormField, RFQInput, RFQTextArea } from "../ui/RFQInputs";

/**
 * Step 7 – Additional Information
 * Fields: Tech Pack URL, Reference Images (one per line), Notes
 */
function AdditionalInfoStep({ formData, setFormData }) {
  const update = (f, v) => setFormData({ ...formData, [f]: v });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Additional Information</h2>
        <p className="text-zinc-500 mt-1 text-sm">
          Tech pack, reference images, and any extra notes.
        </p>
      </div>

      <div className="space-y-5">
        {/* Tech Pack URL */}
        <FormField label="Tech Pack URL">
          <RFQInput
            value={formData.techPackUrl}
            onChange={(v) => update("techPackUrl", v)}
            placeholder="https://drive.google.com/..."
          />
        </FormField>

        {/* Reference Image URLs */}
        <FormField label="Reference Image URLs (one per line)">
          <RFQTextArea
            value={formData.referenceImages}
            onChange={(v) => update("referenceImages", v)}
            placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
            rows={4}
          />
        </FormField>

        {/* General Notes */}
        <FormField label="Notes">
          <RFQTextArea
            value={formData.notes}
            onChange={(v) => update("notes", v)}
            placeholder="Any additional notes or special requirements…"
            rows={5}
          />
        </FormField>
      </div>
    </div>
  );
}

export default AdditionalInfoStep;
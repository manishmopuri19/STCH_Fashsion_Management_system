import { FormField } from "../ui/RFQInputs";
import { FileOrUrlInput } from "../ui/RFQInputs";
import { RFQTextArea } from "../ui/RFQInputs";

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
        {/* Tech Pack — URL or file upload */}
        <FormField label="Tech Pack">
          <p className="text-xs text-zinc-600 mb-1">Paste a link or upload the file directly (PDF, DOCX, ZIP, images — max 20 MB).</p>
          <FileOrUrlInput
            value={formData.techPackUrl}
            onChange={(v) => update("techPackUrl", v)}
            placeholder="https://drive.google.com/…"
            accept=".pdf,.doc,.docx,.xlsx,.xls,.zip,.jpg,.jpeg,.png"
            uploadPath="/rfqs/upload-attachment"
          />
        </FormField>

        {/* Reference Images — URL or file upload (single image or URL) */}
        <FormField label="Reference Image">
          <p className="text-xs text-zinc-600 mb-1">Upload an image file or paste a URL. For multiple images, separate URLs with a new line in the text field.</p>
          <FileOrUrlInput
            value={formData.referenceImages}
            onChange={(v) => update("referenceImages", v)}
            placeholder="https://example.com/image1.jpg"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            uploadPath="/rfqs/upload-attachment"
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

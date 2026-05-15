import { RFQ_OPTIONS } from "../../../constants/rfqConstants";
import { FormField, RFQInput, RFQSelect } from "../ui/RFQInputs";

/**
 * Step 3 – Order Details
 * Fields: Total Quantity (pcs), Target Price per piece, Currency,
 *         Delivery Date, Incoterms
 */
function OrderDetailsStep({ formData, setFormData, errors }) {
  const update = (field, val) => setFormData({ ...formData, [field]: val });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">Order Details</h2>
        <p className="text-zinc-500 mt-1 text-sm">Set quantity, pricing, and delivery information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Total Quantity */}
        <FormField label="Total Quantity (pcs) *" error={errors.quantity}>
          <RFQInput
            type="number"
            value={formData.quantity}
            onChange={(v) => update("quantity", v)}
            placeholder="e.g. 3000"
            className={errors.quantity ? "border-red-500" : ""}
          />
        </FormField>

        {/* Target Price per piece */}
        <FormField label="Target Price per piece *" error={errors.targetPrice}>
          {/* Wrapper for the currency suffix */}
          <div className="relative">
            <RFQInput
              type="number"
              value={formData.targetPrice}
              onChange={(v) => update("targetPrice", v)}
              placeholder="0.00"
              className={`pr-16 ${errors.targetPrice ? "border-red-500" : ""}`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 pointer-events-none">
              {formData.currency || "USD"}
            </span>
          </div>
        </FormField>

        {/* Currency */}
        <FormField label="Currency *" error={errors.currency}>
          <RFQSelect
            options={RFQ_OPTIONS.currencies}
            value={formData.currency}
            onChange={(v) => update("currency", v)}
            placeholder="Select currency"
            className={errors.currency ? "border-red-500" : ""}
          />
        </FormField>

        {/* Delivery Date */}
        <FormField label="Delivery Date *" error={errors.deliveryDate}>
          <RFQInput
            type="date"
            value={formData.deliveryDate}
            onChange={(v) => update("deliveryDate", v)}
            className={errors.deliveryDate ? "border-red-500" : ""}
          />
        </FormField>

        {/* Incoterms */}
        <FormField label="Incoterms *" error={errors.incoterms}>
          <RFQSelect
            options={RFQ_OPTIONS.incoterms}
            value={formData.incoterms}
            onChange={(v) => update("incoterms", v)}
            placeholder="Select incoterms"
            className={errors.incoterms ? "border-red-500" : ""}
          />
        </FormField>
      </div>
    </div>
  );
}

export default OrderDetailsStep;
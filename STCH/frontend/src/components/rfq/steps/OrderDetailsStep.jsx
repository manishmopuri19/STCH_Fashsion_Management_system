const currencies = [
  "INR",
  "USD",
  "EUR",
];

const incoterms = [
  "FOB",
  "CIF",
  "EXW",
  "DDP",
];

function OrderDetailsStep({
  formData,
  setFormData,
  errors,
}) {

  return (
    <div>

      <h2 className="
        text-3xl
        font-semibold
        text-[#111827]
      ">
        Order Details
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Set quantity, pricing, and delivery information
      </p>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        <InputField
          label="Total Quantity (pcs)"
          value={formData.quantity}
          onChange={(value) =>
            setFormData({
              ...formData,
              quantity: value,
            })
          }
          error={errors.quantity}
        />

        <InputField
          label="Target Price per piece"
          value={formData.targetPrice}
          onChange={(value) =>
            setFormData({
              ...formData,
              targetPrice: value,
            })
          }
          error={errors.targetPrice}
        />

        <SelectField
          label="Currency"
          value={formData.currency}
          onChange={(value) =>
            setFormData({
              ...formData,
              currency: value,
            })
          }
          options={currencies}
        />

        <InputField
          label="Delivery Date"
          type="date"
          value={formData.deliveryDate}
          onChange={(value) =>
            setFormData({
              ...formData,
              deliveryDate: value,
            })
          }
        />

        <SelectField
          label="Incoterms"
          value={formData.incoterms}
          onChange={(value) =>
            setFormData({
              ...formData,
              incoterms: value,
            })
          }
          options={incoterms}
        />

      </div>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
}) {

  return (
    <div>

      <label className="
        block
        mb-3
        text-sm
        font-medium
        text-zinc-700
      ">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`
          w-full
          px-5
          py-4
          rounded-xl
          border

          ${
            error
              ? "border-red-500"
              : "border-zinc-300"
          }
        `}
      />

    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {

  return (
    <div>

      <label className="
        block
        mb-3
        text-sm
        font-medium
        text-zinc-700
      ">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          px-5
          py-4
          rounded-xl
          border
          border-zinc-300
        "
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

export default OrderDetailsStep;
// src/components/rfq/steps/BrandInfoStep.jsx

function BrandInfoStep({
  formData,
  setFormData,
  errors,
}) {

  return (
    <div>

      <h2 className="
        text-3xl
        font-semibold
        text-white
      ">
        Brand & Basic Information
      </h2>

      <p className="
        text-zinc-400
        mt-2
        mb-8
      ">
        Select the brand and provide RFQ details
      </p>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        <InputField
          label="Brand"
          value={formData.brand}
          onChange={(value) =>
            setFormData({
              ...formData,
              brand: value,
            })
          }
          error={errors.brand}
        />

        <InputField
          label="Season"
          value={formData.season}
          onChange={(value) =>
            setFormData({
              ...formData,
              season: value,
            })
          }
          error={errors.season}
        />

        <InputField
          label="Department"
          value={formData.department}
          onChange={(value) =>
            setFormData({
              ...formData,
              department: value,
            })
          }
          error={errors.department}
        />

        <InputField
          label="Category"
          value={formData.category}
          onChange={(value) =>
            setFormData({
              ...formData,
              category: value,
            })
          }
          error={errors.category}
        />

        <InputField
          label="Sub Category"
          value={formData.subCategory}
          onChange={(value) =>
            setFormData({
              ...formData,
              subCategory: value,
            })
          }
        />

        <SelectField
          label="Priority"
          value={formData.priority}
          onChange={(value) =>
            setFormData({
              ...formData,
              priority: value,
            })
          }
          options={["LOW", "MEDIUM", "HIGH", "URGENT"]}
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
}) {

  return (
    <div>

      <label className="
        block
        mb-3
        text-sm
        font-medium
        text-zinc-300
      ">
        {label}
      </label>

      <input
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
          bg-[#0F141D]
          text-white
          placeholder:text-zinc-500
          outline-none
          focus:border-orange-500

          ${
            error
              ? "border-red-500"
              : "border-[#2A3142]"
          }
        `}
      />

      {error && (
        <p className="
          text-red-500
          text-sm
          mt-2
        ">
          {error}
        </p>
      )}

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
        text-zinc-300
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
          border-[#2A3142]
          bg-[#0F141D]
          text-white
          outline-none
          focus:border-orange-500
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

export default BrandInfoStep;
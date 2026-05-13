const garmentTypes = [
  "T-Shirt",
  "Polo",
  "Shirt",
  "Hoodie",
  "Jeans",
  "Jacket",
];

const fabricTypes = [
  "Cotton",
  "Polyester",
  "Denim",
  "Linen",
  "Fleece",
  "Jersey",
];

function GarmentDetailsStep({
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
        Garment Details
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Specify fabric and garment specifications
      </p>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        <SelectField
          label="Garment Type"
          value={formData.garmentType}
          onChange={(value) =>
            setFormData({
              ...formData,
              garmentType: value,
            })
          }
          options={garmentTypes}
          error={errors.garmentType}
        />

        <SelectField
          label="Fabric Type"
          value={formData.fabricType}
          onChange={(value) =>
            setFormData({
              ...formData,
              fabricType: value,
            })
          }
          options={fabricTypes}
          error={errors.fabricType}
        />

        <InputField
          label="Fabric Weight (GSM)"
          value={formData.fabricWeight}
          onChange={(value) =>
            setFormData({
              ...formData,
              fabricWeight: value,
            })
          }
        />

        <InputField
          label="Fabric Composition"
          value={formData.fabricComposition}
          onChange={(value) =>
            setFormData({
              ...formData,
              fabricComposition: value,
            })
          }
        />

        <InputField
          label="Construction"
          value={formData.construction}
          onChange={(value) =>
            setFormData({
              ...formData,
              construction: value,
            })
          }
        />

        <InputField
          label="Yarn Count"
          value={formData.yarnCount}
          onChange={(value) =>
            setFormData({
              ...formData,
              yarnCount: value,
            })
          }
        />

      </div>

    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
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
          outline-none
        "
      />

    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
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
        className={`
          w-full
          px-5
          py-4
          rounded-xl
          border
          bg-white

          ${
            error
              ? "border-red-500"
              : "border-zinc-300"
          }
        `}
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

export default GarmentDetailsStep;
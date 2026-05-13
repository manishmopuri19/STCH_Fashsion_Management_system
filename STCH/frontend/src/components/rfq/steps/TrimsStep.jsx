function TrimsStep({
  formData,
  setFormData,
}) {

  return (
    <div>

      <h2 className="
        text-3xl
        font-semibold
        text-[#111827]
      ">
        Trims & Accessories
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Buttons, labels, zippers and packaging details
      </p>

      <div className="space-y-6">

        <TextArea
          label="Trims Details"
          value={formData.trimsDetails}
          onChange={(value) =>
            setFormData({
              ...formData,
              trimsDetails: value,
            })
          }
        />

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">

          <InputField
            label="Packaging Type"
            value={formData.packagingType}
            onChange={(value) =>
              setFormData({
                ...formData,
                packagingType: value,
              })
            }
          />

          <InputField
            label="Label Type"
            value={formData.labelType}
            onChange={(value) =>
              setFormData({
                ...formData,
                labelType: value,
              })
            }
          />

        </div>

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

      <label className="block mb-3 text-sm font-medium text-zinc-700">
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
        "
      />

    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}) {

  return (
    <div>

      <label className="block mb-3 text-sm font-medium text-zinc-700">
        {label}
      </label>

      <textarea
        rows={5}
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
          resize-none
        "
      />

    </div>
  );
}

export default TrimsStep;
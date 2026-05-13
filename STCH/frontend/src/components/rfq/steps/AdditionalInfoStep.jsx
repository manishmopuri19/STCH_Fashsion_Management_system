function AdditionalInfoStep({formData,setFormData}) {

  return (
    <div>

      <h2 className="
        text-3xl
        font-semibold
        text-[#111827]
      ">
        Additional Information
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Tech pack, references and notes
      </p>

      <div className="space-y-6">

        <InputField
          label="Tech Pack URL"
          value={formData.techPackUrl}
          onChange={(value) =>
            setFormData({
              ...formData,
              techPackUrl: value,
            })
          }
        />

        <TextArea
          label="Reference Images"
          value={formData.referenceImages}
          onChange={(value) =>
            setFormData({
              ...formData,
              referenceImages: value,
            })
          }
        />

        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(value) =>
            setFormData({
              ...formData,
              notes: value,
            })
          }
        />

      </div>

    </div>
  );
}

function InputField({label,value,onChange}) {

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

function TextArea({label,value,onChange}) {

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

export default AdditionalInfoStep;
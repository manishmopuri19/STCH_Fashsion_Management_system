const washOptions = [
  "Normal Wash",
  "Enzyme Wash",
  "Stone Wash",
  "Acid Wash",
  "Bleach Wash",
  "Garment Dye",
];

function WashFinishStep({
  formData,
  setFormData,
}) {

  const toggleWash = (wash) => {

    const exists =
      formData.garmentWash.includes(wash);

    if (exists) {

      setFormData({
        ...formData,
        garmentWash:
          formData.garmentWash.filter(
            (item) => item !== wash
          ),
      });

    } else {

      setFormData({
        ...formData,
        garmentWash: [
          ...formData.garmentWash,
          wash,
        ],
      });

    }

  };

  return (
    <div>

      <h2 className="
        text-3xl
        font-semibold
        text-[#111827]
      ">
        Wash & Finish
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Wash, dye, print and embroidery specifications
      </p>

      <div className="space-y-8">

        <div>

          <label className="
            block
            mb-4
            text-sm
            font-medium
            text-zinc-700
          ">
            Garment Wash
          </label>

          <div className="
            flex
            flex-wrap
            gap-3
          ">

            {washOptions.map((wash) => {

              const active =
                formData.garmentWash.includes(
                  wash
                );

              return (
                <button
                  key={wash}
                  type="button"
                  onClick={() =>
                    toggleWash(wash)
                  }
                  className={`
                    px-5
                    py-3
                    rounded-xl
                    border
                    transition-all

                    ${
                      active
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white border-zinc-300 text-zinc-700"
                    }
                  `}
                >
                  {wash}
                </button>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}

export default WashFinishStep;
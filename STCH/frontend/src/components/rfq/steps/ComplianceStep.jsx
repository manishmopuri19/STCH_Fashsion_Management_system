const standards = [
  "OEKO TEX",
  "GOTS",
  "WRAP",
  "ISO 9001",
];

function ComplianceStep({
  formData,
  setFormData,
}) {

  const toggleStandard =
    (standard) => {

      const exists =
        formData.complianceStandards.includes(
          standard
        );

      if (exists) {

        setFormData({
          ...formData,
          complianceStandards:
            formData.complianceStandards.filter(
              (item) =>
                item !== standard
            ),
        });

      } else {

        setFormData({
          ...formData,
          complianceStandards: [
            ...formData.complianceStandards,
            standard,
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
        Compliance & Standards
      </h2>

      <p className="
        text-zinc-500
        mt-2
        mb-8
      ">
        Certifications and quality requirements
      </p>

      <div className="
        flex
        flex-wrap
        gap-3
      ">

        {standards.map((standard) => {

          const active =
            formData.complianceStandards.includes(
              standard
            );

          return (
            <button
              key={standard}
              type="button"
              onClick={() =>
                toggleStandard(standard)
              }
              className={`
                px-5
                py-3
                rounded-xl
                border

                ${
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white border-zinc-300 text-zinc-700"
                }
              `}
            >
              {standard}
            </button>
          );
        })}

      </div>

    </div>
  );
}

export default ComplianceStep;
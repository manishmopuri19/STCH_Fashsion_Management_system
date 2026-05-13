// src/components/rfq/RFQStepper.jsx

const steps = [
  "Brand & Info",
  "Garment Details",
  "Order Details",
  "Trims & Accessories",
  "Wash & Finish",
  "Compliance",
  "Additional Info",
];

function RFQStepper({
  currentStep,
}) {

  return (
    <div className="
      flex
      items-center
      gap-3
      overflow-x-auto
      pb-2
    ">

      {steps.map((step, index) => {

        const active =
          currentStep === index + 1;

        const completed =
          currentStep > index + 1;

        return (
          <div
            key={step}
            className="
              flex
              items-center
              gap-3
              min-w-fit
            "
          >

            <div
              className={`
                flex
                items-center
                gap-3
                px-5
                py-3
                rounded-xl
                border
                transition-all

                ${
                  active
                    ? "bg-orange-500 text-white border-orange-500"
                    : completed
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    : "bg-[#151821] text-zinc-500 border-[#2A3142]"
                }
              `}
            >

              <div className="
                w-6
                h-6
                rounded-full
                bg-white/10
                flex
                items-center
                justify-center
                text-xs
                font-semibold
              ">
                {index + 1}
              </div>

              <span className="
                text-sm
                font-medium
                whitespace-nowrap
              ">
                {step}
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default RFQStepper;
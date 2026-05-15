import { STEPS } from "../../constants/rfqConstants"; 

/**
 * RFQStepper
 * Horizontal step indicator bar.
 * - Completed steps show a check icon and are clickable (to go back).
 * - Active step is highlighted in orange.
 * - Future steps are muted.
 *
 * Props:
 *   currentStep  – number (1-based)
 *   onStepClick  – (stepId: number) => void  (only called for completed steps)
 */
function RFQStepper({ currentStep, onStepClick }) {
  return (
    <nav
      aria-label="RFQ creation steps"
      className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-hide"
    >
      {STEPS.map((step, index) => {
        const isDone   = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isTodo   = currentStep < step.id;

        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            {/* Step button */}
            <button
              type="button"
              disabled={isTodo}
              onClick={() => isDone && onStepClick?.(step.id)}
              aria-current={isActive ? "step" : undefined}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-full
                text-xs font-semibold transition-all duration-200
                ${isDone   ? "bg-emerald-500/10 text-emerald-400 cursor-pointer hover:bg-emerald-500/20" : ""}
                ${isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : ""}
                ${isTodo   ? "bg-[#1A1F2E] text-zinc-600 cursor-default" : ""}
              `}
            >
              {/* Step number / check */}
              <span
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                  ${isDone   ? "bg-emerald-500 text-white" : ""}
                  ${isActive ? "bg-white text-orange-500" : ""}
                  ${isTodo   ? "bg-[#2A3142] text-zinc-500" : ""}
                `}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : step.id}
              </span>

              {/* Label — hide on very small screens */}
              <span className="hidden sm:inline">{step.label}</span>
            </button>

            {/* Arrow separator */}
            {index < STEPS.length - 1 && (
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="mx-0.5 flex-shrink-0 text-[#2A3142]"
                aria-hidden="true"
              >
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default RFQStepper;
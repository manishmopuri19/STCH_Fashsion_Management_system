import {
  X,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useState } from "react";

import SupplierQuotationStep
from "./SupplierQuotationStep";

import CommercialReviewStep
from "./CommercialReviewStep";

import GeneratePOStep
from "./GeneratePOStep";


const steps = [

  "Supplier Quotations",

  "Commercial Review",

  "Generate PO",
];


function RFQWorkflowDrawer({

  open,

  onClose,

  rfq,

  onSuccess
}) {

  const [currentStep,
    setCurrentStep] =
    useState(0);

  const [selectedQuotation,
    setSelectedQuotation] =
    useState(null);


  return (

    <div className={`
      fixed
      inset-0
      z-50

      ${open
        ? "visible"
        : "invisible"}
    `}>

      {/* OVERLAY */}
      <div

        onClick={onClose}

        className={`
          absolute
          inset-0
          bg-black/60
          backdrop-blur-sm
          transition-all

          ${open
            ? "opacity-100"
            : "opacity-0"}
        `}
      />

      {/* DRAWER */}
      <div className={`
        absolute
        right-0
        top-0
        h-full
        w-[700px]
        bg-[#11141D]
        border-l
        border-[#2A3142]
        transition-all
        duration-300
        overflow-y-auto

        ${open
          ? "translate-x-0"
          : "translate-x-full"}
      `}>

        {/* HEADER */}
        <div className="
          p-7
          border-b
          border-[#2A3142]
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <h1 className="
                text-2xl
                font-bold
                text-white
              ">
                RFQ Workflow
              </h1>

              <p className="
                text-zinc-500
                mt-2
              ">
                Commercial sourcing workflow
              </p>

            </div>

            <button

              onClick={onClose}

              className="
                w-11
                h-11
                rounded-xl
                bg-[#1A1F2B]
                flex
                items-center
                justify-center
                text-zinc-400
              "
            >

              <X size={20} />

            </button>

          </div>


          {/* STEPS */}
          <div className="
            flex
            items-center
            gap-5
            mt-8
          ">

            {steps.map(
              (step, index) => (

              <div
                key={step}
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {index <= currentStep ? (

                  <CheckCircle2
                    className="
                      text-violet-400
                    "
                    size={22}
                  />

                ) : (

                  <Circle
                    className="
                      text-zinc-600
                    "
                    size={22}
                  />

                )}

                <span className={`
                  text-sm

                  ${index <= currentStep
                    ? "text-white"
                    : "text-zinc-500"}
                `}>

                  {step}

                </span>

              </div>

            ))}

          </div>

        </div>


        {/* BODY */}
        <div className="p-7">

          {/* STEP 1 */}
          {currentStep === 0 && (

            <SupplierQuotationStep

              rfq={rfq}

              onNext={(quotation) => {

                setSelectedQuotation(
                  quotation
                );

                setCurrentStep(1);
              }}
            />
          )}


          {/* STEP 2 */}
          {currentStep === 1 && (

            <CommercialReviewStep

              rfq={rfq}

              quotation={
                selectedQuotation
              }

              onBack={() =>
                setCurrentStep(0)
              }

              onNext={() =>
                setCurrentStep(2)
              }
            />
          )}


          {/* STEP 3 */}
          {currentStep === 2 && (

            <GeneratePOStep

              rfq={rfq}

              quotation={
                selectedQuotation
              }

              onBack={() =>
                setCurrentStep(1)
              }

              onSuccess={() => {

                onSuccess();

                onClose();
              }}
            />
          )}

        </div>

      </div>

    </div>
  );
}

export default RFQWorkflowDrawer;
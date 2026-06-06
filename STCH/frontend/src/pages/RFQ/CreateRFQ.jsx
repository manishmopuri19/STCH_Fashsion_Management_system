import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import RFQStepper from "../../components/rfq/RFQStepper";
import BrandInfoStep from "../../components/rfq/steps/BrandInfoStep";
import GarmentDetailsStep from "../../components/rfq/steps/GarmentDetailsStep";
import OrderDetailsStep from "../../components/rfq/steps/OrderDetailsStep";
import TrimsStep from "../../components/rfq/steps/TrimsStep";
import WashFinishStep from "../../components/rfq/steps/WashFinishStep";
import ComplianceStep from "../../components/rfq/steps/ComplianceStep";
import AdditionalInfoStep from "../../components/rfq/steps/AdditionalInfoStep";

import { INITIAL_FORM_DATA } from "../../constants/rfqConstants";

const TOTAL_STEPS = 7;

// ─── Per-step validation rules ────────────────────────────────────────────────
function validateStep(step, formData) {
  const e = {};

  if (step === 1) {
    if (!formData.brand?.trim())      e.brand      = "Brand name is required";
    if (!formData.season)             e.season      = "Season is required";
    if (!formData.department)         e.department  = "Department is required";
    if (!formData.priority)           e.priority    = "Priority is required";
  }

  if (step === 2) {
    if (!formData.garmentType)        e.garmentType      = "Select a garment type";
    if (!formData.fabricType)         e.fabricType       = "Select a fabric type";
    if (!formData.fabricWeight)       e.fabricWeight     = "Fabric weight (GSM) is required";
    if (!formData.fabricComposition?.trim())
                                      e.fabricComposition = "Fabric composition is required";
  }

  if (step === 3) {
    if (!formData.quantity)           e.quantity     = "Quantity is required";
    if (!formData.targetPrice)        e.targetPrice  = "Target price is required";
    if (!formData.deliveryDate)       e.deliveryDate = "Delivery date is required";
    if (!formData.incoterms)          e.incoterms    = "Incoterms is required";
  }

  if (step === 4) {
    if (!formData.trimsDetails?.trim())   e.trimsDetails  = "Trims details are required";
    if (!formData.packagingType?.trim())  e.packagingType = "Packaging type is required";
    if (!formData.labelType?.trim())      e.labelType     = "Label type is required";
  }

  if (step === 5) {
    if (!formData.garmentWash?.length)
      e.garmentWash = "Select at least one wash option";
  }

  if (step === 6) {
    if (!formData.complianceStandards?.length)
      e.complianceStandards = "Select at least one compliance standard";
    if (!formData.testingRequired?.length)
      e.testingRequired = "Select at least one testing requirement";
  }

  // Step 7 – Additional Info has no required fields

  return e; // empty object = valid
}

// ─── Component ────────────────────────────────────────────────────────────────
const CreateRFQ = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors]           = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [formData, setFormData]       = useState(INITIAL_FORM_DATA);

  // Shared props passed to every step component
  const stepProps = { formData, setFormData, errors };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <BrandInfoStep      {...stepProps} />;
      case 2: return <GarmentDetailsStep {...stepProps} />;
      case 3: return <OrderDetailsStep   {...stepProps} />;
      case 4: return <TrimsStep          {...stepProps} />;
      case 5: return <WashFinishStep     {...stepProps} />;
      case 6: return <ComplianceStep     {...stepProps} />;
      case 7: return <AdditionalInfoStep {...stepProps} />;
      default: return null;
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (stepId) => {
    // Only allow jumping back to already-completed steps
    if (stepId < currentStep) {
      setErrors({});
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  
const handleSubmit = async () => {
  const stepErrors = validateStep(currentStep, formData);
  
  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors);
    return;
  }

  setSubmitting(true);
  try {
    const payload = {
      brand: formData.brand,
      customer_id: formData.customerId || null,
      season: formData.season,
      department: formData.department,
      category: formData.category,
      sub_category: formData.subCategory, 
      priority: formData.priority?.toUpperCase(),
      garment_type: formData.garmentType, 
      fabric_type: formData.fabricType,   
      fabric_weight: formData.fabricWeight.toString(), 
      fabric_composition: formData.fabricComposition,
      construction: formData.construction,
      yarn_count: formData.yarnCount,
      quantity: parseInt(formData.quantity, 10),
      target_price: parseFloat(formData.targetPrice), 
      currency: "INR",
      delivery_date: formData.deliveryDate,
      incoterms: formData.incoterms,
      trims_details: formData.trimsDetails, 
      packaging_type: formData.packagingType, 
      label_type: formData.labelType,       
      garment_wash: formData.garmentWash,
      dye_type: formData.dyeType,
      print_type: formData.printType,
      embroidery_type: formData.embroideryType,
      special_finish: formData.specialFinish,
      compliance_standards: formData.complianceStandards, 
      testing_required: formData.testingRequired,         
      social_compliance: formData.socialCompliance,       
      quality_standards: formData.qualityStandards,       
      tech_pack_url: formData.techPackUrl,                
      reference_images: formData.referenceImages,         
      notes: formData.notes
    };

    const response = await API.post("/rfqs/", payload);
    navigate("/rfqs");
  } catch (err) {
    console.error("Validation Error:", err.response?.data?.detail);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0F1115] px-4 py-8 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-white">Create New RFQ</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Fill in the details to create a new Request for Quotation
          </p>
        </div>

        {/* Step indicator */}
        <RFQStepper currentStep={currentStep} onStepClick={handleStepClick} />

        {/* Form card */}
        <div className="bg-[#11151D] border border-[#2A3142] rounded-3xl p-6 sm:p-8">
          {renderStep()}

          {/* Navigation footer */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-[#2A3142]">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                px-7 py-2.5 rounded-xl border border-[#2A3142] text-sm font-medium text-zinc-400
                transition-colors duration-150
                ${currentStep === 1
                  ? "invisible pointer-events-none"
                  : "hover:bg-[#1D2230] active:scale-95"}
              `}
            >
              Previous
            </button>

        
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-zinc-500 text-sm font-medium hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="
                    px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400
                    text-white text-sm font-semibold
                    shadow-lg shadow-orange-500/20
                    transition-all duration-150 active:scale-95
                  "
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="
                    px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                    text-white text-sm font-semibold
                    transition-all duration-150 active:scale-95
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {submitting ? "Creating…" : "Create RFQ"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRFQ;
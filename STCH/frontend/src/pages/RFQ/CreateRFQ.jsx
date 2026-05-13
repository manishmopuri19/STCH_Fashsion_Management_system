// src/pages/RFQ/CreateRFQ.jsx

import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import RFQStepper from "../../components/rfq/RFQStepper";

import BrandInfoStep from "../../components/rfq/steps/BrandInfoStep";
import GarmentDetailsStep from "../../components/rfq/steps/GarmentDetailsStep";
import OrderDetailsStep from "../../components/rfq/steps/OrderDetailsStep";
import TrimsStep from "../../components/rfq/steps/TrimsStep";
import WashFinishStep from "../../components/rfq/steps/WashFinishStep";
import ComplianceStep from "../../components/rfq/steps/ComplianceStep";
import AdditionalInfoStep from "../../components/rfq/steps/AdditionalInfoStep";

const initialFormData = {
  brand: "",
  season: "",
  department: "",
  category: "",
  subCategory: "",
  priority: "",

  garmentType: "",
  fabricType: "",
  fabricWeight: "",
  fabricComposition: "",
  construction: "",
  yarnCount: "",

  quantity: "",
  targetPrice: "",
  currency: "",
  deliveryDate: "",
  incoterms: "",

  trimsDetails: "",
  packagingType: "",
  labelType: "",

  garmentWash: [],
  dyeType: "",
  printType: "",
  embroideryType: "",
  specialFinish: "",

  complianceStandards: [],
  testingRequired: [],
  socialCompliance: "",
  qualityStandards: "",

  techPackUrl: "",
  referenceImages: "",
  notes: "",
};

function CreateRFQ() {
  const navigate=useNavigate();


  const [currentStep, setCurrentStep] =
    useState(1);

  const [errors, setErrors] =
    useState({});

  const [formData, setFormData] =
    useState(initialFormData);

  const validateStep = () => {

    let newErrors = {};

    if (currentStep === 1) {

      if (!formData.brand.trim()) {
        newErrors.brand =
          "Brand is required";
      }

      if (!formData.season.trim()) {
        newErrors.season =
          "Season is required";
      }

      if (!formData.department.trim()) {
        newErrors.department =
          "Department is required";
      }

      if (!formData.category.trim()) {
        newErrors.category =
          "Category is required";
      }

    }

    if (currentStep === 2) {

      if (!formData.garmentType.trim()) {
        newErrors.garmentType =
          "Garment type required";
      }

      if (!formData.fabricType.trim()) {
        newErrors.fabricType =
          "Fabric type required";
      }

    }

    if (currentStep === 3) {

      if (!formData.quantity.trim()) {
        newErrors.quantity =
          "Quantity required";
      }

      if (!formData.targetPrice.trim()) {
        newErrors.targetPrice =
          "Target price required";
      }

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {

    const valid = validateStep();

    if (!valid) return;

    setCurrentStep((prev) => prev + 1);

  };

  const handlePrevious = () => {

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }

  };
const handleSubmit = async () => {

  if (!formData.priority || !formData.deliveryDate) {

    alert("Please fill in Priority and Delivery Date");

    return;
  }

  const payload = {

    rfq_number:
      `RFQ-${Math.floor(1000 + Math.random() * 9000)}`,

    brand: formData.brand,

    season: formData.season,

    priority: formData.priority,

    garment_type: formData.garmentType,

    fabric_type: formData.fabricType,

    quantity: Number(formData.quantity),

    target_price: Number(formData.targetPrice),

    currency: formData.currency || "USD",

    delivery_date: formData.deliveryDate,

    department: formData.department,

    category: formData.category,

    sub_category: formData.subCategory,

    fabric_weight: formData.fabricWeight,

    fabric_composition:
      formData.fabricComposition,

    construction: formData.construction,

    yarn_count: formData.yarnCount,

    incoterms: formData.incoterms,

    trims_details: formData.trimsDetails,

    packaging_type: formData.packagingType,

    label_type: formData.labelType,

    garment_wash: formData.garmentWash || [],

    compliance_standards:
      formData.complianceStandards || [],

    tech_pack_url: formData.techPackUrl,

    reference_images:
      formData.referenceImages,

    notes: formData.notes,

    status: "NEW"
  };

  try {

    const response =
      await API.post("/create", payload);

    console.log(response.data);

    navigate("/rfqs");

  } catch (error) {

    console.error(
      error.response?.data
    );

  }

};
  const renderStep = () => {

    switch (currentStep) {

      case 1:
        return (
          <BrandInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );

      case 2:
        return (
          <GarmentDetailsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );

      case 3:
        return (
          <OrderDetailsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        );

      case 4:
        return (
          <TrimsStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 5:
        return (
          <WashFinishStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 6:
        return (
          <ComplianceStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 7:
        return (
          <AdditionalInfoStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      default:
        return null;

    }

  };

  return (
    <div className="
      min-h-screen
      bg-[#0B0F19]
      px-6
      py-8
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="
            text-4xl
            font-bold
            text-white
          ">
            Create New RFQ
          </h1>

          <p className="
            text-zinc-400
            mt-2
          ">
            Fill in the details to create a new Request for Quotation
          </p>

        </div>

        {/* STEPPER */}
        <RFQStepper
          currentStep={currentStep}
        />

        {/* FORM CARD */}
        <div className="
          mt-8
          bg-[#151821]
          border
          border-[#2A3142]
          rounded-3xl
          p-8
          shadow-2xl
        ">

          {renderStep()}

          {/* FOOTER */}
          <div className="
            mt-10
            flex
            items-center
            justify-between
            border-t
            border-[#2A3142]
            pt-6
          ">

            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="
                px-6
                py-3
                rounded-xl
                border
                border-[#2A3142]
                bg-[#0F141D]
                text-zinc-300
                disabled:opacity-40
              "
            >
              Previous
            </button>

            <div className="
              flex
              items-center
              gap-4
            ">

              <button
                className="
                  text-zinc-500
                  font-medium
                "
              >
                Cancel
              </button>

              {currentStep < 7 ? (

                <button
                  onClick={handleNext}
                  className="
                    px-8
                    py-3
                    rounded-xl
                    bg-orange-500
                    hover:bg-orange-400
                    transition-all
                    text-white
                    font-medium
                  "
                >
                  Next
                </button>

              ) : (

                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all text-white font-medium">
                  Submit RFQ
                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateRFQ;
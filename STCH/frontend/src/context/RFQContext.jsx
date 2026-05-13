import {
  createContext,
  useContext,
  useState,
} from "react";

const RFQContext = createContext();

const initialRFQData = {
  client_details: {
    brand_name: "",
    collection_name: "",
    city_country: "",
  },

  product_details: {
    sample_image: null,
    product_name: "",
    product_category: "",
    brand_target_price: "",
    supplier_target_rate: "",
    expected_quantity: "",
    fabric_type: "",
    fabric_gsm: "",
    color_preferences: "",
    size_ratio: "",
    search_category: "",
  },

  order_details: {
    order_type: "",
    attachment: null,
  },

  tagging_details: {
    trim_details: [],
    garment_wash: [],
    value_additions: [],
    packaging_details: [],
  },

  testing_details: {
    testing_details: [],
    inspection_qc: [],
    aql_level: "",
  },

  payment_details: {
    advance_payment: "",
    payment_credit_terms: "",
    location_restrictions: "",
  },

  other_details: {
    compliance_requirement: "",
    reason_for_requirement: [],
    other_details: "",
    source: "",
    key_insights: "",
  },
};

export function RFQProvider({ children }) {

  const [rfqData, setRFQData] =
    useState(initialRFQData);

  const updateSection = (
    section,
    values
  ) => {
    setRFQData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values,
      },
    }));
  };

  return (
    <RFQContext.Provider
      value={{
        rfqData,
        updateSection,
      }}
    >
      {children}
    </RFQContext.Provider>
  );
}

export const useRFQ = () =>
  useContext(RFQContext);
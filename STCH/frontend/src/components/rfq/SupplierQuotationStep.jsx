import { useEffect, useState } from "react";

import API from "../../api/axios";


function SupplierQuotationStep({
  rfq,
  onNext
}) {

  const [suppliers, setSuppliers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({

      supplier_id: "",

      supplier_target_price:
        rfq.target_price,

      quoted_price: "",

      moq: "",

      lead_time: "",

      payment_terms: "",

      remarks: "",
    });


  useEffect(() => {

    fetchSuppliers();

  }, []);


  const fetchSuppliers =
    async () => {

    try {

      const response =
        await API.get("/suppliers");

      setSuppliers(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  const handleChange =
    (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const createQuotation =
    async () => {

    const supplierId =        parseInt(formData.supplier_id);
    const targetPrice =       parseFloat(formData.supplier_target_price);
    const quotedPrice =       parseFloat(formData.quoted_price);
    const moq =               parseInt(formData.moq);
    const leadTime =          parseInt(formData.lead_time);

    if (!supplierId)                    return setError("Please select a supplier.");
    if (isNaN(targetPrice))             return setError("Supplier target price is required.");
    if (isNaN(quotedPrice))             return setError("Quoted price is required.");
    if (isNaN(moq))                     return setError("MOQ is required.");
    if (isNaN(leadTime))                return setError("Lead time is required.");
    if (!formData.payment_terms.trim()) return setError("Payment terms are required.");

    setError("");

    try {

      setLoading(true);

      const response =
        await API.post(

          `/rfqs/${rfq.id}/suppliers`,

          {
            supplier_id:            supplierId,
            supplier_target_price:  targetPrice,
            quoted_price:           quotedPrice,
            moq:                    moq,
            lead_time:              leadTime,
            payment_terms:          formData.payment_terms,
            remarks:                formData.remarks || null,
          }
        );

      onNext(response.data);

    } catch (err) {

      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Failed to assign supplier. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="space-y-6">

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-white
        ">
          Add Supplier Quotation
        </h2>

        <p className="
          text-zinc-500
          mt-2
        ">
          Add commercial quotation details
        </p>

      </div>


      {/* FORM */}
      <div className="
        grid
        grid-cols-2
        gap-5
      ">

        <div className="col-span-2">

          <label className="
            block
            mb-2
            text-sm
            text-zinc-400
          ">
            Supplier
          </label>

          <select

            value={
              formData.supplier_id
            }

            onChange={(e) =>
              handleChange(
                "supplier_id",
                e.target.value
              )
            }

            className="
              w-full
              px-4
              py-4
              rounded-2xl
              bg-[#151821]
              border
              border-[#2A3142]
              text-white
            "
          >

            <option value="">
              Select supplier
            </option>

            {suppliers.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >

                {item.company_name}

              </option>

            ))}

          </select>

        </div>


        <Input
          label="Supplier Target Price"
          value={
            formData.supplier_target_price
          }
          onChange={(value) =>
            handleChange(
              "supplier_target_price",
              value
            )
          }
        />

        <Input
          label="Quoted Price"
          value={
            formData.quoted_price
          }
          onChange={(value) =>
            handleChange(
              "quoted_price",
              value
            )
          }
        />

        <Input
          label="MOQ"
          value={formData.moq}
          onChange={(value) =>
            handleChange("moq", value)
          }
        />

        <Input
          label="Lead Time"
          value={formData.lead_time}
          onChange={(value) =>
            handleChange(
              "lead_time",
              value
            )
          }
        />

        <div className="col-span-2">

          <label className="
            block
            mb-2
            text-sm
            text-zinc-400
          ">
            Payment Terms
          </label>

          <textarea

            rows={3}

            value={
              formData.payment_terms
            }

            onChange={(e) =>
              handleChange(
                "payment_terms",
                e.target.value
              )
            }

            className="
              w-full
              px-4
              py-4
              rounded-2xl
              bg-[#151821]
              border
              border-[#2A3142]
              text-white
              resize-none
            "
          />

        </div>


        <div className="col-span-2">

          <label className="
            block
            mb-2
            text-sm
            text-zinc-400
          ">
            Remarks
          </label>

          <textarea

            rows={4}

            value={formData.remarks}

            onChange={(e) =>
              handleChange(
                "remarks",
                e.target.value
              )
            }

            className="
              w-full
              px-4
              py-4
              rounded-2xl
              bg-[#151821]
              border
              border-[#2A3142]
              text-white
              resize-none
            "
          />

        </div>

      </div>


      {/* ERROR */}
      {error && (
        <p className="
          text-red-400
          text-sm
          -mt-2
        ">
          {error}
        </p>
      )}

      {/* CTA */}
      <button

        onClick={createQuotation}

        disabled={loading}

        className="
          w-full
          py-4
          rounded-2xl
          bg-violet-500
          hover:bg-violet-400
          transition-all
          font-semibold
          text-white
        "
      >

        {loading
          ? "Creating..."
          : "Continue to Commercial Review"}

      </button>

    </div>
  );
}


function Input({
  label,
  value,
  onChange
}) {

  return (

    <div>

      <label className="
        block
        mb-2
        text-sm
        text-zinc-400
      ">
        {label}
      </label>

      <input

        value={value}

        onChange={(e) =>
          onChange(e.target.value)
        }

        className="
          w-full
          px-4
          py-4
          rounded-2xl
          bg-[#151821]
          border
          border-[#2A3142]
          text-white
        "
      />

    </div>
  );
}

export default SupplierQuotationStep;
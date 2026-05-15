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

    try {

      setLoading(true);

      const response =
        await API.post(

          `/rfqs/${rfq.id}/suppliers`,

          formData
        );

      onNext(response.data);

    } catch (error) {

      console.log(error);

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
import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import API from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

function SupplierDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [supplier, setSupplier] =
    useState(null);

  useEffect(() => {

    fetchSupplier();

  }, [id]);

  const fetchSupplier = async () => {

    try {

      const response =
        await API.get(`/suppliers/${id}`);

      setSupplier(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  if (!supplier) {

    return (
      <div className="
        min-h-screen
        bg-[#0B0F19]
        flex
        items-center
        justify-center
        text-white
      ">
        Loading...
      </div>
    );
  }

  return (

    <DashboardLayout>

      <div className="
        max-w-5xl
        mx-auto
        space-y-8
      ">

        <button

          onClick={() =>
            navigate(-1)
          }

          className="
            text-zinc-400
          "
        >

          ← Back

        </button>

        <div className="
          bg-[#151821]
          border
          border-[#2A3142]
          rounded-3xl
          p-8
        ">

          <h1 className="
            text-4xl
            font-bold
            text-white
          ">
            {supplier.company_name}
          </h1>

          <p className="
            text-zinc-500
            mt-2
          ">
            {supplier.specialization}
          </p>

          <div className="
            grid
            grid-cols-2
            gap-6
            mt-10
          ">

            <Info
              label="Contact Person"
              value={supplier.contact_person}
            />

            <Info
              label="Email"
              value={supplier.email}
            />

            <Info
              label="Phone"
              value={supplier.phone}
            />

            <Info
              label="Country"
              value={supplier.country}
            />

            <Info
              label="City"
              value={supplier.city}
            />

            <Info
              label="MOQ"
              value={supplier.minimum_order_quantity}
            />

            <Info
              label="Lead Time"
              value={`${supplier.lead_time} Days`}
            />

            <Info
              label="Address"
              value={supplier.address}
            />

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

function Info({ label, value }) {

  return (

    <div className="
      bg-[#0F141D]
      border
      border-[#2A3142]
      rounded-2xl
      p-5
    ">

      <p className="
        text-zinc-500
        text-sm
      ">
        {label}
      </p>

      <p className="
        text-white
        mt-2
      ">
        {value || "-"}
      </p>

    </div>
  );
}

export default SupplierDetailPage;
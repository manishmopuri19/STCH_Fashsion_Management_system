// components/orders/details/OrderCommercials.jsx

import { useState } from "react";

import API from "../../../api/axios";

const formatMoney = (value) =>
  Number(value || 0).toFixed(2);

function OrderCommercials({
  order,
  refresh
}) {

  const [formData, setFormData] =
    useState({

      supplier_price:
        order.supplier_price,

      lead_time:
        order.lead_time,

      payment_terms:
        order.payment_terms
    });

  const updateCommercials =
    async () => {

    try {

      await API.patch(
        `/purchase-orders/${order.id}/commercials`,
        formData
      );

      refresh();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-3xl
      p-8
    ">

      <h2 className="
        text-3xl
        font-bold
        text-white
      ">

        Commercials

      </h2>

      <div className="
        grid
        grid-cols-2
        gap-6
        mt-8
      ">

        <Field
          label="Supplier Price"
          value={formData.supplier_price}
          onChange={(e) =>
            setFormData({
              ...formData,
              supplier_price:
                e.target.value
            })
          }
        />

        <Field
          label="Lead Time"
          value={formData.lead_time}
          onChange={(e) =>
            setFormData({
              ...formData,
              lead_time:
                e.target.value
            })
          }
        />

        <Field
          label="Payment Terms"
          value={formData.payment_terms}
          onChange={(e) =>
            setFormData({
              ...formData,
              payment_terms:
                e.target.value
            })
          }
        />

      </div>

      <div className="
        mt-8
        grid
        grid-cols-3
        gap-5
      ">

        <Card
          title="Margin"
          value={`${formatMoney(
            order.margin
          )}%`}
        />

        <Card
          title="Profitability"
          value={`${formatMoney(
            order.profitability
          )}%`}
        />

        <Card
          title="Total"
          value={`$${formatMoney(
            order.total_amount
          )}`}
        />

      </div>

      <button

        onClick={updateCommercials}

        className="
          mt-8
          px-6
          py-4
          rounded-2xl
          bg-orange-500
          text-white
        "
      >

        Update Commercials

      </button>

    </div>
  );
}

function Field({
  label,
  value,
  onChange
}) {

  return (

    <div>

      <p className="
        text-zinc-500
        mb-3
      ">
        {label}
      </p>

      <input

        value={value}

        onChange={onChange}

        className="
          w-full
          px-5
          py-4
          rounded-2xl
          bg-[#0F141D]
          border
          border-[#2A3142]
          text-white
        "
      />

    </div>
  );
}

function Card({
  title,
  value
}) {

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
      ">
        {title}
      </p>

      <h2 className="
        text-3xl
        font-bold
        text-white
        mt-3
      ">

        {value}

      </h2>

    </div>
  );
}

export default OrderCommercials;
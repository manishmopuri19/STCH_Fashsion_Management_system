// components/orders/details/OrderSupplierCard.jsx

function OrderSupplierCard({ order }) {

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-3xl
      p-6
    ">

      <h2 className="
        text-2xl
        font-bold
        text-white
      ">

        Supplier

      </h2>

      <div className="
        mt-6
        space-y-5
      ">

        <Info
          label="Supplier ID"
          value={order.supplier_id}
        />

        <Info
          label="Currency"
          value="INR"
        />

        <Info
          label="Payment Terms"
          value={order.payment_terms}
        />

      </div>

    </div>
  );
}

function Info({
  label,
  value
}) {

  return (

    <div>

      <p className="
        text-zinc-500
        text-sm
      ">
        {label}
      </p>

      <p className="
        text-white
        mt-1
      ">
        {value || "-"}
      </p>

    </div>
  );
}

export default OrderSupplierCard;
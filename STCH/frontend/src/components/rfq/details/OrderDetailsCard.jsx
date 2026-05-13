function OrderDetailsCard({ rfq }) {

  return (

    <div className="
      bg-[#121826]
      rounded-2xl
      border
      border-[#1D2230]
      p-8
    ">

      <h2 className="
        text-white
        text-xl
        font-semibold
        mb-8
      ">
        ORDER DETAILS
      </h2>

      <div className="
        grid
        grid-cols-3
        gap-8
      ">

        <InfoItem
          label="Quantity"
          value={rfq.quantity}
        />

        <InfoItem
          label="Target Price"
          value={`₹${rfq.target_price}`}
        />

        <InfoItem
          label="Currency"
          value={rfq.currency}
        />

        <InfoItem
          label="Delivery Date"
          value={rfq.delivery_date}
        />

        <InfoItem
          label="Incoterms"
          value={rfq.incoterms}
        />

      </div>

    </div>

  );

}

function InfoItem({
  label,
  value
}) {

  return (

    <div>

      <p className="
        text-zinc-500
        text-sm
        mb-2
      ">
        {label}
      </p>

      <p className="
        text-white
        text-xl
      ">
        {value || "-"}
      </p>

    </div>

  );

}

export default OrderDetailsCard;
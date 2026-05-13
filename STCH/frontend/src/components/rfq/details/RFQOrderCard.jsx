function RFQOrderCard({ rfq }) {

  return (

    <div
      className="
        bg-[#11151D]
        border
        border-[#2A3142]
        rounded-3xl
        p-8
      "
    >

      <h2
        className="
          text-xl
          text-white
          font-semibold
          mb-8
        "
      >
        Order Details
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <div>

          <p className="text-zinc-500">
            Quantity
          </p>

          <p className="text-white mt-2">
            {rfq.quantity}
          </p>

        </div>

        <div>

          <p className="text-zinc-500">
            Target Price
          </p>

          <p className="text-white mt-2">
            ₹{rfq.target_price}
          </p>

        </div>

      </div>

    </div>

  );
}

export default RFQOrderCard;
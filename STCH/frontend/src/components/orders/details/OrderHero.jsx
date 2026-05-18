// components/orders/details/OrderHero.jsx

const formatMoney = (value) =>
  Number(value || 0).toFixed(2);

function OrderHero({ order }) {

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-3xl
      p-8
    ">

      <div className="
        flex
        items-start
        justify-between
      ">

        <div>

          <p className="
            text-zinc-500
          ">
            Purchase Order
          </p>

          <h1 className="
            text-5xl
            font-bold
            text-white
            mt-3
          ">

            {order.po_number}

          </h1>

          <div className="
            flex
            gap-4
            mt-5
          ">

            <Badge
              label={order.status}
            />

            <Badge
              label={`${order.lead_time} Days`}
            />

          </div>

        </div>

        <div className="
          text-right
        ">

          <p className="
            text-zinc-500
          ">
            Total Amount
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-orange-400
            mt-2
          ">

            ${formatMoney(
              order.total_amount
            )}

          </h2>

        </div>

      </div>

    </div>
  );
}

function Badge({ label }) {

  return (

    <div className="
      px-4
      py-2
      rounded-xl
      bg-[#0F141D]
      border
      border-[#2A3142]
      text-white
      text-sm
    ">

      {label}

    </div>
  );
}

export default OrderHero;
const formatMoney = (value) =>
  Number(value || 0).toFixed(2);

function OrdersStats({ orders }) {

  const totalValue =
    orders.reduce(
      (acc, curr) =>
        acc + (
          curr.total_amount || 0
        ),
      0
    );

  const avgMargin =
    orders.length
      ? orders.reduce(
          (acc, curr) =>
            acc + (
              curr.margin || 0
            ),
          0
        ) / orders.length
      : 0;

  return (

    <div className="
      grid
      grid-cols-3
      gap-5
    ">

      <Card
        title="Total Orders"
        value={orders.length}
      />

      <Card
        title="Total Value"
        value={`₹${formatMoney(
          totalValue
        )}`}
      />

      <Card
        title="Avg Margin"
        value={`${formatMoney(
          avgMargin
        )}%`}
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
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-2xl
      p-5
    ">

      <p className="
        text-zinc-500
        text-sm
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

export default OrdersStats;
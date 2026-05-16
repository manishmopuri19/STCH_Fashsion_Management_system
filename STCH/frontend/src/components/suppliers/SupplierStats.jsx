function SupplierStats({ suppliers }) {

  const countries =
    new Set(
      suppliers.map(
        (s) => s.country
      )
    ).size;

  return (

    <div className="
      grid
      grid-cols-3
      gap-5
    ">

      <Card
        title="Total Suppliers"
        value={suppliers.length}
      />

      <Card
        title="Countries"
        value={countries}
      />

      <Card
        title="Avg MOQ"
        value={
          Math.round(
            suppliers.reduce(
              (acc, curr) =>
                acc +
                (curr.minimum_order_quantity || 0),
              0
            ) / suppliers.length
          ) || 0
        }
      />

    </div>
  );
}

function Card({ title, value }) {

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

export default SupplierStats;
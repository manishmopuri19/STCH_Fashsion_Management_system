function RFQFabricCard({ rfq }) {

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
        Fabric & Construction
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <div>

          <p className="text-zinc-500">
            Fabric Type
          </p>

          <p className="text-white mt-2">
            {rfq.fabric_type}
          </p>

        </div>

        <div>

          <p className="text-zinc-500">
            Composition
          </p>

          <p className="text-white mt-2">
            {rfq.fabric_composition}
          </p>

        </div>

      </div>

    </div>

  );
}

export default RFQFabricCard;
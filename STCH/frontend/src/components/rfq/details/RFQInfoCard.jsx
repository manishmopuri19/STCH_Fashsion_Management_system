function RFQInfoCard({ rfq }) {

  return (

    <div className="
      bg-[#121826]
      rounded-2xl
      border
      border-[#1D2230]
      p-8
    ">

      <div className="
        flex
        gap-4
        mb-8
      ">

        <span className="
          px-4
          py-2
          rounded-full
          bg-green-500/20
          text-green-400
        ">
          {rfq.status}
        </span>

        <span className="
          px-4
          py-2
          rounded-full
          bg-red-500/20
          text-red-400
        ">
          {rfq.priority}
        </span>

      </div>

      <div className="
        grid
        grid-cols-3
        gap-8
      ">

        <InfoItem
          label="Brand"
          value={rfq.brand}
        />

        <InfoItem
          label="Season"
          value={rfq.season}
        />

        <InfoItem
          label="Department"
          value={rfq.department}
        />

        <InfoItem
          label="Category"
          value={rfq.category}
        />

        <InfoItem
          label="Sub Category"
          value={rfq.sub_category}
        />

        <InfoItem
          label="Garment Type"
          value={rfq.garment_type}
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

export default RFQInfoCard;
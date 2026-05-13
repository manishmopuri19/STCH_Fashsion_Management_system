import RFQEditField
from "./RFQEditField";

function RFQSummaryCard({ rfq }) {

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

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <RFQEditField
          label="Brand"
          value={rfq.brand}
        />

        <RFQEditField
          label="Season"
          value={rfq.season}
        />

        <RFQEditField
          label="Category"
          value={rfq.category}
        />

        <RFQEditField
          label="Garment Type"
          value={rfq.garment_type}
        />

      </div>

    </div>

  );
}

export default RFQSummaryCard;
function FabricConstructionCard({ rfq }) {

  return (

    <div className=" bg-[#121826] rounded-2xl border border-[#1D2230] p-8
    ">

      <h2 className="text-white text-xl font-semibold mb-8 ">
FABRIC & CONSTRUCTION
      </h2>

      <div className="grid grid-cols-3 gap-8">

<InfoItem
  label="Fabric Type"
  value={rfq.fabric_type}
/>

<InfoItem
  label="Fabric Weight"
  value={rfq.fabric_weight}
/>

<InfoItem
  label="Composition"
  value={rfq.fabric_composition}
/>

<InfoItem
  label="Construction"
  value={rfq.construction}
/>

<InfoItem
  label="Yarn Count"
  value={rfq.yarn_count}
/>

      </div>

    </div>

  );

}

function InfoItem({label,value}) {

  return (

    <div>

      <p className="text-zinc-500 text-sm mb-2">{label}</p>

      <p className="text-white text-xl">{value || "-"}
      </p>

    </div>

  );

}

export default FabricConstructionCard;
import PipelineCard from "./PipelineCard";

function PipelineSection({ title, data }) {
  return (
    <div className="mt-10">

      <h2 className="text-2xl font-semibold mb-5">
        {title}
      </h2>

      <div className="flex gap-5 overflow-x-auto">

        {data.map((item, index) => (
          <PipelineCard
            key={index}
            stage={item.stage}
            count={item.count}
          />
        ))}

      </div>

    </div>
  );
}

export default PipelineSection;
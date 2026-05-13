function PipelineCard({ stage, count }) {
  return (
    <div className="min-w-[180px] bg-zinc-950 border border-zinc-900 rounded-2xl p-5">

      <p className="text-zinc-500 text-sm">
        {stage}
      </p>

      <h3 className="text-3xl font-semibold mt-4">
        {count}
      </h3>

    </div>
  );
}

export default PipelineCard;
import StatsCard from "./StatsCard";

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">

      {stats.map((item, index) => (
        <StatsCard
          key={index}
          title={item.title}
          value={item.value}
          change={item.change}
        />
      ))}

    </div>
  );
}

export default StatsGrid;
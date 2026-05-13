function ActivityFeed({ activities }) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 mt-10">

      <h2 className="text-2xl font-semibold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-b border-zinc-900 pb-3 text-zinc-400"
          >
            {activity}
          </div>
        ))}

      </div>

    </div>
  );
}

export default ActivityFeed;
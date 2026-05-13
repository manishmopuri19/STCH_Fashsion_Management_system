import {
  ArrowUpRight,
  Circle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function StatsCard({
  title,
  value,
  change,
}) {

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/${title.toLowerCase()}`)}
      className="
        group
        relative
        overflow-hidden
        bg-[#1A1F2B]
        border
        border-[#2A3142]
        rounded-3xl
        p-6
        hover:bg-[#232938]
        transition-all
        duration-300
        hover:-translate-y-1
        text-left
      "
    >

      {/* GLOW */}
      <div className="
        absolute
        top-0
        right-0
        w-32
        h-32
        bg-blue-500/10
        blur-3xl
        rounded-full
      " />

      {/* HEADER */}
      <div className="relative z-10 flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <Circle
              size={10}
              fill="currentColor"
              className="text-emerald-400 animate-pulse"
            />

            <p className="text-zinc-400 text-sm">
              {title}
            </p>

          </div>

          <h2 className="text-5xl font-semibold mt-5 text-white tracking-tight">
            {value}
          </h2>

        </div>

        {/* ICON BOX */}
        <div className="
          w-14
          h-14
          rounded-2xl
          bg-[#283041]
          border
          border-[#374151]
          flex
          items-center
          justify-center
          group-hover:scale-110
          transition-all
          duration-300
        ">

          <ArrowUpRight
            size={22}
            className="
              text-zinc-300
              group-hover:text-white
              group-hover:-translate-y-1
              group-hover:translate-x-1
              transition-all
              duration-300
            "
          />

        </div>

      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-8 flex items-center justify-between">

        <p className="text-sm text-zinc-500">
          View operational details
        </p>

        <span className="text-sm text-emerald-400 font-medium">
          {change}
        </span>

      </div>

    </button>
  );
}

export default StatsCard;
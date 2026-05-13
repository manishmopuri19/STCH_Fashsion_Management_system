import { Menu } from "lucide-react";

function Topbar({ setSidebarOpen }) {
  return (
    <div className="
      h-[90px]
      px-4
      sm:px-8
      flex
      items-center
      justify-between
      border-b
      border-[#2A3142]
      bg-[#0F1115]/80
      backdrop-blur-xl
      sticky
      top-0
      z-30
    ">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            w-11
            h-11
            rounded-xl
            bg-[#1A1F2B]
            border
            border-[#2A3142]
            flex
            items-center
            justify-center
          "
        >
          <Menu size={20} />
        </button>

        {/* TITLES */}
        <div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            welcome, Admin
          </h1>

          <p className="text-zinc-500 mt-1 hidden sm:block">
            Monitor sourcing, production and delivery workflows.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Topbar;
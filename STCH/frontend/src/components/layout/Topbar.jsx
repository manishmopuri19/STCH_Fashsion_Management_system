import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Topbar({ setSidebarOpen }) {
  const { user } = useAuth();

  return (
    <div className="h-[90px] px-4 sm:px-8 flex items-center justify-between border-b border-[#2A3142] bg-[#0F1115]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-11 h-11 rounded-xl bg-[#1A1F2B] border border-[#2A3142] flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white capitalize">
            {/* If user is admin, show 'welcome, Admin'. Otherwise show their name. */}
            {user?.role === "ADMIN" ? "welcome, Admin" : `welcome, ${user?.userName || "User"}`}
          </h1>

          <p className="text-zinc-500 mt-1 hidden sm:block">
            {user?.role === "ADMIN" 
              ? "Monitor sourcing, production and delivery workflows." 
              : "Access your dashboard and active tasks."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
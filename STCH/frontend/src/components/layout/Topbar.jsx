import { useState, useRef, useEffect } from "react";
import { Menu, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_COLORS = {
  ADMIN: "bg-red-500/10 text-red-400",
  MERCHANDISER: "bg-blue-500/10 text-blue-400",
  MEMBER: "bg-zinc-500/10 text-zinc-400",
  SUPPLIER: "bg-emerald-500/10 text-emerald-400",
  QUALITY_CONTROL: "bg-purple-500/10 text-purple-400",
};

function Topbar({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-[56px] px-4 sm:px-8 flex items-center justify-between border-b border-[#2A3142] bg-[#0F1115]/80 backdrop-blur-xl sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden w-8 h-8 rounded-lg bg-[#1A1F2B] border border-[#2A3142] flex items-center justify-center"
        >
          <Menu size={16} />
        </button>

        <h1 className="text-sm font-semibold text-white capitalize">
          {user?.role === "ADMIN" ? "Welcome, Admin" : `Welcome, ${user?.userName || "User"}`}
        </h1>
      </div>

      {/* RIGHT — profile button */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1 rounded-xl bg-[#151821] border border-[#2A3142] hover:border-orange-500/50 transition-all duration-200"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.userName}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{user?.role?.replace("_", " ")}</p>
          </div>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="dropdown-enter absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-[#2A3142] bg-[#151821] shadow-2xl overflow-hidden z-50">
            {/* user info */}
            <div className="px-4 py-4 border-b border-[#2A3142]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.userName}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
              </div>
              <span
                className={`mt-3 inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ROLE_COLORS[user?.role] || "bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {user?.role?.replace("_", " ")}
              </span>
            </div>

            {/* actions */}
            <button
              onClick={() => { setOpen(false); navigate("/settings"); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-[#1D2230] transition-all"
            >
              <Settings size={15} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#1D2230] transition-all border-t border-[#2A3142]"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topbar;
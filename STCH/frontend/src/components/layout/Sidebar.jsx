import {
  LayoutDashboard,
  FileText,
  Package,
  ClipboardList,
  ShieldCheck,
  Users,
  X,
  Settings,LogOut,
  ChevronUp,
  Layers3
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "RFQ", path: "/rfqs" },
  { icon: Package, label: "Orders", path: "/orders" },
{
  icon: Layers3,
  label: "Catalogs",
  path: "/catalogs"
},
  { icon: ShieldCheck, label: "QC", path: "/qc" },
  { icon: Users, label: "Suppliers", path: "/suppliers" },
  { icon: Settings, label: "User Management", path: "/users" },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

const [profileMenuOpen,
setProfileMenuOpen] =
useState(false);

  const roleBasedMenus = {

  ADMIN: [
    "Dashboard",
    "RFQ",
    "Orders",
    "Catalogs",
    "QC",
    "Suppliers",
    "User Management",
  ],

  MERCHANDISER: [
    "Dashboard",
    "RFQ",
    "Orders",
    "Catalogs",
    "QC",
    "Suppliers",
  ],
  MEMBER: [
    "Dashboard",
    "RFQ",
    "Orders",
    "Catalogs",
  ]
,
  SUPPLIER: [
    "Dashboard",
    "RFQ",
    "Orders",
    "Catalogs"
  ],
};

const allowedMenus =
  roleBasedMenus[user?.role] || [];

const filteredMenuItems =
  menuItems.filter((item) =>
    allowedMenus.includes(item.label)
  );
  


  return (
    <>
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex fixed left-5 top-5 h-[calc(100vh-40px)] w-[92px] bg-[#151821] border border-[#2A3142] rounded-3xl flex-col items-center py-6 shadow-2xl z-50">
        <SidebarContent filteredMenuItems={filteredMenuItems} user={user}  profileMenuOpen={profileMenuOpen}
  setProfileMenuOpen={setProfileMenuOpen}/>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#151821] border-r border-[#2A3142] z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#2A3142]">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 rounded-xl bg-[#1D2230] border border-[#2A3142] flex items-center justify-center text-zinc-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {filteredMenuItems.map((item, index) => (
            <MobileSidebarItem
              key={index}
              item={item}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function SidebarContent({

  filteredMenuItems,

  user,

  profileMenuOpen,

  setProfileMenuOpen

}) {

  const navigate = useNavigate();

  return (
    <>

      {/* MENU */}
      <div className="flex flex-col gap-4 mt-14">

        {filteredMenuItems.map((item, index) => (

          <SidebarItem
            key={index}
            item={item}
          />

        ))}

      </div>

      {/* PROFILE */}
      <div className="mt-auto relative">

        {/* AVATAR */}
        <button

          onClick={() =>
            setProfileMenuOpen(
              !profileMenuOpen
            )
          }

          className="
            w-12
            h-12
            rounded-full
            bg-gradient-to-br
            from-orange-400
            to-orange-600
            flex
            items-center
            justify-center
            text-sm
            font-semibold
            text-white
            cursor-pointer
            hover:scale-105
            transition-all
            duration-300
          "
        >

          {
            user?.userName
            ?.charAt(0)
            ?.toUpperCase() || "A"
          }

        </button>

        {/* DROPDOWN */}
        {profileMenuOpen && (

          <div className="
            absolute
            bottom-16
            left-0
            w-56
            rounded-2xl
            border
            border-[#2A3142]
            bg-[#151821]
            shadow-2xl
            overflow-hidden
            z-50
          ">

            {/* USER INFO */}
            <div className="
              px-4
              py-4
              border-b
              border-[#2A3142]
            ">

              <p className="
                text-sm
                font-semibold
                text-white
              ">
                {user?.userName}
              </p>

              <p className="
                text-xs
                text-zinc-500
                mt-1
              ">
                {user?.email}
              </p>

            </div>

            {/* SETTINGS */}
            <button

              onClick={() =>
                navigate("/settings")
              }

              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-sm
                text-zinc-300
                hover:bg-[#1D2230]
                transition-all
              "
            >

              <Settings size={16} />

              Settings

            </button>

            {/* LOGOUT */}
            <button

              onClick={() => {

                localStorage.removeItem(
                  "token"
                );

                localStorage.removeItem(
                  "user"
                );

                navigate("/login");
              }}

              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-sm
                text-red-400
                hover:bg-[#1D2230]
                transition-all
              "
            >

              Logout

            </button>

          </div>
        )}

      </div>

    </>
  );
}

function SidebarItem({ item }) {
  const Icon = item.icon;
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <div className="group relative">
      {isActive && (
        <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-orange-500" />
      )}
      <button
        onClick={() => navigate(item.path)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
          isActive
            ? "bg-gradient-to-br from-orange-500 to-orange-400 text-white border-transparent shadow-lg shadow-orange-500/20 scale-105"
            : "bg-[#1D2230] text-zinc-500 border-[#2A3142] hover:bg-[#283041] hover:text-white hover:scale-105"
        }`}
      >
        <Icon size={20} className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
      </button>

      <div className="absolute left-20 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-[#1D2230] border border-[#2A3142] text-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
        {item.label}
      </div>
    </div>
  );
}

function MobileSidebarItem({ item, setSidebarOpen }) {
  const Icon = item.icon;
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === item.path;

  const handleNavigation = () => {
    navigate(item.path);
    setSidebarOpen(false);
  };

  return (
    <button
      onClick={handleNavigation}
      className={`group w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
          : "bg-[#1D2230] text-zinc-400 hover:bg-[#283041]"
      }`}
    >
      <Icon size={20} className="transition-all duration-300 group-hover:rotate-6 group-hover:scale-110" />
      <span className="font-medium">{item.label}</span>
    </button>
  );
}

export default Sidebar;
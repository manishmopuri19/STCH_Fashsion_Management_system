import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function DashboardLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            z-40
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="lg:ml-[120px]">

        <Topbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="
          p-4
          sm:p-6
          lg:p-8
          space-y-8
          overflow-hidden
        ">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
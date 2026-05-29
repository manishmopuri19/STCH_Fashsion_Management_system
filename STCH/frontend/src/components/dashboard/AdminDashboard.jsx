import { useEffect, useState } from "react";

import {
  FileText,
  Package,
  IndianRupee,
  TrendingUp,
  Clock3,
} from "lucide-react";

import API from "../../api/axios";

import KPICard from "../../components/dashboard/KPICard";

import Sidebar from "../../components/layout/Sidebar";
import DashboardLayout from "../../layouts/DashboardLayout";

const formatNumber = (value) =>
  Number(value || 0).toFixed(2);

function AdminDashboard() {

  const [dashboard,setDashboard] =useState(null);
  const [loading, setLoading] =useState(true);


  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard =
    async () => {

    try {

      const response =
        await API.get("/dashboard");

      console.log(
        "DASHBOARD:",
        response.data
      );

      setDashboard(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  if(loading){

    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        flex
        items-center
        justify-center
        text-white
      ">

        Loading Dashboard...

      </div>
    );
  }


  return (

   <DashboardLayout>

        <div className="
          max-w-[1700px]
          mx-auto
          space-y-8
        ">

          {/* HEADER */}
          <div>

            <h1 className="
              text-4xl
              font-bold
            ">
              Admin Dashboard
            </h1>

            <p className="
              text-zinc-500
              mt-2
            ">
              Business overview & sourcing intelligence
            </p>

          </div>


          {/* KPI GRID */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          ">

            <KPICard
              title="Total RFQs"
              value={
                dashboard?.rfqs
                  ?.total_rfqs || 0
              }
              icon={<FileText />}
            />

            <KPICard
              title="Purchase Orders"
              value={
                dashboard?.purchase_orders
                  ?.total_pos || 0
              }
              icon={<Package />}
              color="
                from-blue-500
                to-cyan-500
              "
            />

            <KPICard
              title="PO Value"
              value={`₹${formatNumber(
  dashboard?.purchase_orders?.total_po_value
)}`}
              icon={<IndianRupee />}
              color="
                from-emerald-500
                to-green-500
              "
            />

            <KPICard
              title="Avg Margin"
              value={`${formatNumber(
  dashboard?.purchase_orders?.avg_margin
)}%`}
              icon={<TrendingUp />}
              color="
                from-violet-500
                to-pink-500
              "
            />

            <KPICard
              title="Delayed TNA"
              value={
                dashboard?.tna
                  ?.delayed_tna || 0
              }
              icon={<Clock3 />}
              color="
                from-orange-500
                to-red-500
              "
            />

            <KPICard
              title="QC Pass Rate"
              value={`${dashboard?.qc?.pass_rate || 0}%`}
              icon={<TrendingUp />}
              color="
                from-yellow-500
                to-orange-500
              "
            />

          </div>


          {/* ANALYTICS */}
          <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          ">

            {/* RFQ ANALYTICS */}
            <div className="
              bg-[#151821]
              border
              border-[#2A3142]
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-2xl
                font-semibold
                mb-6
              ">
                RFQ Analytics
              </h2>

              <div className="
                space-y-5
              ">

                <AnalyticsRow
                  label="Total RFQs"
                  value={
                    dashboard?.rfqs
                      ?.total_rfqs
                  }
                />

              </div>

            </div>


            {/* PURCHASE ORDER */}
            <div className="
              bg-[#151821]
              border
              border-[#2A3142]
              rounded-3xl
              p-6
            ">

              <h2 className="
                text-2xl
                font-semibold
                mb-6
              ">
                Purchase Orders
              </h2>

              <div className="
                space-y-5
              ">

                <AnalyticsRow
                  label="Total POs"
                  value={
                    dashboard
                    ?.purchase_orders
                    ?.total_pos
                  }
                />

                <AnalyticsRow
                  label="Total Value"
                  value={`₹${dashboard
                    ?.purchase_orders
                    ?.total_po_value}`}
                />

                <AnalyticsRow
                  label="Average Margin"
                  value={`${dashboard
                    ?.purchase_orders
                    ?.avg_margin}%`}
                />

              </div>

            </div>

          </div>

        </div>

    </DashboardLayout>
  );
}


function AnalyticsRow({
  label,
  value
}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      p-4
      rounded-2xl
      bg-[#0F141D]
      border
      border-[#2A3142]
    ">

      <span className="
        text-zinc-400
      ">
        {label}
      </span>

      <span className="
        text-xl
        font-semibold
        text-white
      ">
        {value || 0}
      </span>

    </div>
  );
}

export default AdminDashboard;
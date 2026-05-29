import { useEffect, useState } from "react";

import {
  FileText,
  Clock3,
  AlertTriangle,
  Package,
  TrendingUp,
} from "lucide-react";

import API from "../../api/axios";

import KPICard from "../../components/dashboard/KPICard";
import DashboardLayout from "../../layouts/DashboardLayout";


function MerchDashboard() {

  const [dashboard,
    setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetchDashboard();

  }, []);


  const fetchDashboard =
    async () => {

    try {

      const response =
        await API.get("/dashboard");

      console.log(
        "MERCH DASHBOARD:",
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
            Merchandiser Dashboard
          </h1>

          <p className="
            text-zinc-500
            mt-2
          ">
            Sourcing operations & workflow management
          </p>

        </div>


        {/* KPI */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-5
          gap-6
        ">

          <KPICard
            title="Assigned RFQs"
            value={
              dashboard?.rfqs
                ?.assigned_rfqs || 0
            }
            icon={<FileText />}
          />

          <KPICard
            title="Negotiation RFQs"
            value={
              dashboard?.rfqs
                ?.negotiation_rfqs || 0
            }
            icon={<TrendingUp />}
            color="
              from-violet-500
              to-pink-500
            "
          />

          <KPICard
            title="Pending Quotations"
            value={
              dashboard?.quotations
                ?.pending || 0
            }
            icon={<Clock3 />}
            color="
              from-yellow-500
              to-orange-500
            "
          />

          <KPICard
            title="Urgent Deliveries"
            value={
              dashboard?.purchase_orders
                ?.urgent_deliveries || 0
            }
            icon={<AlertTriangle />}
            color="
              from-red-500
              to-orange-500
            "
          />

          <KPICard
            title="Delayed TNA"
            value={
              dashboard?.tna
                ?.delayed || 0
            }
            icon={<Package />}
            color="
              from-cyan-500
              to-blue-500
            "
          />

        </div>


        {/* CONTENT */}
        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          {/* RFQ PIPELINE */}
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
              RFQ Workflow Pipeline
            </h2>


            <div className="
              space-y-5
            ">

              {Object.entries(
                dashboard?.pipeline || {}
              ).map(([key, value]) => (

                <div key={key}>

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  ">

                    <span className="
                      text-zinc-300
                    ">
                      {key}
                    </span>

                    <span className="
                      font-semibold
                    ">
                      {value}
                    </span>

                  </div>

                  <div className="w-full h-3 rounded-full bg-[#0F141D] overflow-hidden ">

                    <div
                      style={{
                        width: `${value * 10}%`
                      }}
                      className=" h-full bg-gradient-to-r from-violet-500 to-blue-500 "/>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* URGENT RFQS */}
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
              Urgent RFQs
            </h2>


            <div className="
              space-y-4
            ">

              {dashboard?.urgent_rfqs
                ?.map((rfq) => (

                <div

                  key={rfq.id}

                  className="
                    p-5
                    rounded-2xl
                    bg-[#0F141D]
                    border
                    border-[#2A3142]
                  "
                >

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div>

                      <h3 className="
                        text-lg
                        font-semibold
                      ">
                        {rfq.rfq_number}
                      </h3>

                      <p className="
                        text-zinc-500
                        mt-1
                      ">
                        {rfq.brand}
                      </p>

                    </div>

                    <div className="
                      px-4
                      py-2
                      rounded-xl
                      bg-red-500/20
                      text-red-400
                      text-sm
                    ">

                      {rfq.priority}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* RECENT ACTIVITY */}
        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl p-6">

          <h2 className="text-2xl font-semibold mb-6
          ">
            Recent Workflow Activity
          </h2>


          <div className="
            space-y-5
          ">

            {dashboard?.activities
              ?.map((activity) => (

              <div

                key={activity.id}

                className="
                  flex
                  items-start
                  gap-4
                  border-b
                  border-[#2A3142]
                  pb-5
                "
              >

                <div className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-violet-500/20
                  flex
                  items-center
                  justify-center
                ">

                  <FileText size={18} />

                </div>

                <div>

                  <p className="
                    text-white
                  ">
                    {activity.message}
                  </p>

                  <p className="
                    text-sm
                    text-zinc-500
                    mt-2
                  ">
                    {activity.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default MerchDashboard;
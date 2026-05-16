import { useEffect, useState } from "react";

import {
  FileText,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import API from "../../api/axios";

import KPICard from "../../components/dashboard/KPICard";

import DashboardLayout from "../../layouts/DashboardLayout";

function SupplierDashboard() {

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
        "SUPPLIER DASHBOARD:",
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
            Supplier Dashboard
          </h1>

          <p className="
            text-zinc-500
            mt-2
          ">
            Vendor operations & execution portal
          </p>

        </div>


        {/* KPI */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
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
            title="Submitted Quotations"
            value={
              dashboard?.quotations
                ?.submitted || 0
            }
            icon={<CheckCircle2 />}
            color="
              from-violet-500
              to-pink-500
            "
          />

          <KPICard
            title="Active Purchase Orders"
            value={
              dashboard?.purchase_orders
                ?.active || 0
            }
            icon={<Package />}
            color="
              from-blue-500
              to-cyan-500
            "
          />

          <KPICard
            title="Pending Deliveries"
            value={
              dashboard?.deliveries
                ?.pending || 0
            }
            icon={<Truck />}
            color="
              from-orange-500
              to-red-500
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

          {/* ASSIGNED RFQS */}
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
              Assigned RFQs
            </h2>


            <div className="
              space-y-4
            ">

              {dashboard?.assigned_rfqs
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

                    <button className="
                      px-5
                      py-2
                      rounded-xl
                      bg-violet-500
                      hover:bg-violet-400
                      transition-all
                      text-sm
                    ">

                      Submit Quote

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* ACTIVE POS */}
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
              Active Purchase Orders
            </h2>


            <div className="
              space-y-4
            ">

              {dashboard?.active_pos
                ?.map((po) => (

                <div

                  key={po.id}

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
                        {po.po_number}
                      </h3>

                      <p className="
                        text-zinc-500
                        mt-1
                      ">
                        Qty: {po.quantity}
                      </p>

                    </div>

                    <div className="
                      text-right
                    ">

                      <p className="
                        text-sm
                        text-zinc-500
                      ">
                        Delivery
                      </p>

                      <p className="
                        text-white
                        font-medium
                        mt-1
                      ">
                        {po.delivery_date}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* TNA */}
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
            TNA Milestones
          </h2>


          <div className="
            space-y-4
          ">

            {dashboard?.tna_tasks
              ?.map((task) => (

              <div

                key={task.id}

                className="
                  flex
                  items-center
                  justify-between
                  p-5
                  rounded-2xl
                  bg-[#0F141D]
                  border
                  border-[#2A3142]
                "
              >

                <div>

                  <h3 className="
                    font-semibold
                  ">
                    {task.title}
                  </h3>

                  <p className="
                    text-zinc-500
                    text-sm
                    mt-1
                  ">
                    {task.po_number}
                  </p>

                </div>

                <div className="
                  text-right
                ">

                  <p className="
                    text-sm
                    text-zinc-500
                  ">
                    Due Date
                  </p>

                  <p className="
                    text-white
                    mt-1
                  ">
                    {task.due_date}
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

export default SupplierDashboard;
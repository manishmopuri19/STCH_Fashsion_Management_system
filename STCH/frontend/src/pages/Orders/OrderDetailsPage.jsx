// pages/orders/OrderDetailPage.jsx

import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import API from "../../api/axios";

import DashboardLayout
from "../../layouts/DashboardLayout";

import {
  CalendarDays,
  Clock3,
  DollarSign,
  PackageCheck,
  Shirt,
  Truck
} from "lucide-react";


const formatMoney = (value) =>
  Number(value || 0).toFixed(2);


function OrderDetailPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetchOrder();

  }, [id]);


  const fetchOrder = async () => {

    try {

      const response =
        await API.get(
          `/purchase-orders/${id}`
        );

      setOrder(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#0B0F19]
        flex
        items-center
        justify-center
        text-white
      ">

        Loading Order...

      </div>
    );
  }


  return (

    <DashboardLayout>

      <div className="
        max-w-[1800px]
        mx-auto
        space-y-8
      ">

        {/* TOP NAV */}
        <div className="
          flex
          items-center
          justify-between
        ">

          <button

            onClick={() =>
              navigate("/orders")
            }

            className="
              text-zinc-400
              hover:text-white
              transition-all
            "
          >

            ← Back to Orders

          </button>

          <div className="
            px-5
            py-3
            rounded-2xl
            bg-orange-500
            text-white
            font-semibold
          ">

            {order?.status
              ?.replaceAll(
                "_",
                " "
              )}

          </div>

        </div>


        {/* HERO */}
        <div className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-[#2A3142]
          bg-[#151821]
          p-10
        ">

          {/* GLOW */}
          <div className="
            absolute
            top-0
            right-0
            w-[500px]
            h-[500px]
            bg-orange-500/10
            blur-[120px]
          " />

          <div className="
            relative
            z-10
          ">

            <div className="
              flex
              items-start
              justify-between
              gap-10
            ">

              {/* LEFT */}
              <div>

                <p className="
                  text-zinc-500
                  uppercase
                  tracking-[4px]
                  text-sm
                ">

                  Purchase Order

                </p>

                <h1 className="
                  text-6xl
                  font-black
                  text-white
                  mt-5
                ">

                  {order?.po_number}

                </h1>

                <div className="
                  flex
                  gap-4
                  mt-8
                  flex-wrap
                ">

                  <Pill
                    icon={<Shirt size={16} />}
                    text={
                      order?.rfq
                        ?.garment_type
                    }
                  />

                  <Pill
                    icon={<Truck size={16} />}
                    text={
                      order?.lead_time
                        ? `${order.lead_time} Days`
                        : "-"
                    }
                  />

                  <Pill
                    icon={<CalendarDays size={16} />}
                    text={
                      order?.delivery_date
                    }
                  />

                </div>

              </div>


              {/* RIGHT */}
              <div className="
                min-w-[320px]
                rounded-3xl
                bg-[#0F141D]
                border
                border-[#2A3142]
                p-8
              ">

                <p className="
                  text-zinc-500
                  text-sm
                ">

                  Total Order Value

                </p>

                <h2 className="
                  text-5xl
                  font-black
                  text-white
                  mt-4
                ">

                  $
                  {formatMoney(
                    order?.commercials
                      ?.total_amount
                  )}

                </h2>

                <div className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-4
                ">

                  <MiniMetric
                    label="Margin"
                    value={`${formatMoney(
                      order?.commercials
                        ?.margin
                    )}%`}
                  />

                  <MiniMetric
                    label="Profit"
                    value={`${formatMoney(
                      order?.commercials
                        ?.profitability
                    )}%`}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ACTION CENTER */}
<div className="
  grid
  grid-cols-1
  xl:grid-cols-3
  gap-6
">

  {/* STATUS */}
  <div className="
    rounded-[32px]
    border
    border-[#2A3142]
    bg-[#151821]
    p-8
  ">

    <div className="
      flex
      items-center
      justify-between
    ">

      <div>

        <p className="
          text-zinc-500
          text-sm
        ">

          Workflow Status

        </p>

        <h2 className="
          text-3xl
          font-bold
          text-white
          mt-2
        ">

          {order?.status
            ?.replaceAll(
              "_",
              " "
            )}

        </h2>

      </div>

      <div className="
        w-14
        h-14
        rounded-2xl
        bg-orange-500/20
        flex
        items-center
        justify-center
      ">

        <PackageCheck
          className="
            text-orange-400
          "
        />

      </div>

    </div>

    <div className="
      mt-8
      space-y-3
    ">

      {[
        "CREATED",
        "APPROVED",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED"
      ].map((status) => (

        <button

          key={status}

          onClick={() =>
            updatePOStatus(status)
          }

          className={`
            w-full
            py-4
            rounded-2xl
            font-medium
            transition-all

            ${order?.status === status

              ? `
                bg-orange-500
                text-white
              `

              : `
                bg-[#0F141D]
                border
                border-[#2A3142]
                text-zinc-400
                hover:border-orange-500/40
              `
            }
          `}
        >

          {status.replaceAll(
            "_",
            " "
          )}

        </button>

      ))}

    </div>

  </div>


  {/* EDIT COMMERCIALS */}
  <div className="
    rounded-[32px]
    border
    border-[#2A3142]
    bg-[#151821]
    p-8
  ">

    <div className="
      flex
      items-center
      justify-between
    ">

      <div>

        <p className="
          text-zinc-500
          text-sm
        ">

          Commercial Actions

        </p>

        <h2 className="
          text-3xl
          font-bold
          text-white
          mt-2
        ">

          Edit PO

        </h2>

      </div>

      <div className="
        w-14
        h-14
        rounded-2xl
        bg-blue-500/20
        flex
        items-center
        justify-center
      ">

        <DollarSign
          className="
            text-blue-400
          "
        />

      </div>

    </div>

    <div className="
      mt-8
      space-y-4
    ">

      <button

        onClick={() =>
          setShowEditModal(true)
        }

        className="
          w-full
          py-4
          rounded-2xl
          bg-blue-500
          text-white
          font-semibold
          hover:scale-[1.02]
          transition-all
        "
      >

        Edit Commercials

      </button>

      <button

        className="
          w-full
          py-4
          rounded-2xl
          bg-[#0F141D]
          border
          border-[#2A3142]
          text-zinc-300
        "
      >

        Update Delivery

      </button>

    </div>

  </div>


  {/* TNA */}
  <div className="
    rounded-[32px]
    border
    border-[#2A3142]
    bg-[#151821]
    p-8
  ">

    <div className="
      flex
      items-center
      justify-between
    ">

      <div>

        <p className="
          text-zinc-500
          text-sm
        ">

          Production Workflow

        </p>

        <h2 className="
          text-3xl
          font-bold
          text-white
          mt-2
        ">

          TNA Board

        </h2>

      </div>

      <div className="
        w-14
        h-14
        rounded-2xl
        bg-emerald-500/20
        flex
        items-center
        justify-center
      ">

        <CalendarDays
          className="
            text-emerald-400
          "
        />

      </div>

    </div>

    <div className="
      mt-8
      space-y-4
    ">

      <button

        onClick={() =>
          navigate(
            `/orders/${id}/workflow`
          )
        }

        className="
          w-full
          py-4
          rounded-2xl
          bg-emerald-500
          text-white
          font-semibold
          hover:scale-[1.02]
          transition-all
        "
      >

        View TNA Board

      </button>

      <button

        className="
          w-full
          py-4
          rounded-2xl
          bg-[#0F141D]
          border
          border-[#2A3142]
          text-zinc-300
        "
      >

        Create Activity

      </button>

    </div>

  </div>

</div>
        <div className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        ">

          {/* LEFT SIDE */}
          <div className="
            xl:col-span-2
            space-y-6
          ">

            {/* PRODUCT */}
            <GlassCard title="Product Details">

              <InfoGrid>

                <Info
                  label="Brand"
                  value={
                    order?.rfq?.brand
                  }
                />

                <Info
                  label="Garment"
                  value={
                    order?.rfq
                      ?.garment_type
                  }
                />

                <Info
                  label="Fabric"
                  value={
                    order?.rfq
                      ?.fabric_type
                  }
                />

                <Info
                  label="Quantity"
                  value={
                    order?.quantity
                  }
                />

              </InfoGrid>

            </GlassCard>


            {/* COMMERCIALS */}
            <GlassCard title="Commercials">

              <MetricRow>

                <MetricCard
                  title="Target Price"
                  value={`$${formatMoney(
                    order?.commercials
                      ?.target_price
                  )}`}
                />

                <MetricCard
                  title="Supplier Price"
                  value={`$${formatMoney(
                    order?.commercials
                      ?.supplier_price
                  )}`}
                />

                <MetricCard
                  title="Total Amount"
                  value={`$${formatMoney(
                    order?.commercials
                      ?.total_amount
                  )}`}
                />

              </MetricRow>

            </GlassCard>

          </div>


          {/* RIGHT SIDE */}
          <div className="
            space-y-6
          ">

            {/* SUPPLIER */}
            <GlassCard title="Supplier">

              <div className="
                flex
                items-center
                gap-5
              ">

                <div className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-orange-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-2xl
                  font-bold
                ">

                  {order?.supplier
                    ?.company_name
                    ?.charAt(0)}

                </div>

                <div>

                  <h3 className="
                    text-2xl
                    font-bold
                    text-white
                  ">

                    {
                      order?.supplier
                        ?.company_name
                    }

                  </h3>

                  <p className="
                    text-zinc-500
                    mt-1
                  ">

                    {
                      order?.supplier
                        ?.email
                    }

                  </p>

                </div>

              </div>

            </GlassCard>


            {/* ORDER INFO */}
            <GlassCard title="Order Info">

              <div className="
                space-y-5
              ">

                <InfoRow
                  icon={<Clock3 size={18} />}
                  label="Lead Time"
                  value={`${order?.lead_time} Days`}
                />

                <InfoRow
                  icon={<DollarSign size={18} />}
                  label="Currency"
                  value={order?.currency}
                />

                <InfoRow
                  icon={<PackageCheck size={18} />}
                  label="Payment Terms"
                  value={
                    order?.payment_terms
                  }
                />

              </div>

            </GlassCard>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}


/* UI */

function GlassCard({
  title,
  children
}) {

  return (

    <div className="
      rounded-[32px]
      border
      border-[#2A3142]
      bg-[#151821]
      p-8
      shadow-2xl
    ">

      <h2 className="
        text-2xl
        font-bold
        text-white
        mb-8
      ">

        {title}

      </h2>

      {children}

    </div>
  );
}


function Pill({
  icon,
  text
}) {

  return (

    <div className="
      flex
      items-center
      gap-3
      px-5
      py-3
      rounded-2xl
      bg-[#0F141D]
      border
      border-[#2A3142]
      text-white
    ">

      {icon}

      <span>

        {text || "-"}

      </span>

    </div>
  );
}


function InfoGrid({
  children
}) {

  return (

    <div className="
      grid
      grid-cols-2
      gap-5
    ">

      {children}

    </div>
  );
}


function Info({
  label,
  value
}) {

  return (

    <div className="
      rounded-2xl
      bg-[#0F141D]
      border
      border-[#2A3142]
      p-5
    ">

      <p className="
        text-zinc-500
        text-sm
      ">

        {label}

      </p>

      <h3 className="
        text-xl
        font-bold
        text-white
        mt-3
      ">

        {value || "-"}

      </h3>

    </div>
  );
}


function MetricRow({
  children
}) {

  return (

    <div className="
      grid
      grid-cols-3
      gap-5
    ">

      {children}

    </div>
  );
}


function MetricCard({
  title,
  value
}) {

  return (

    <div className="
      rounded-2xl
      bg-gradient-to-br
      from-orange-500
      to-orange-400
      p-6
    ">

      <p className="
        text-orange-100
        text-sm
      ">

        {title}

      </p>

      <h2 className="
        text-3xl
        font-black
        text-white
        mt-4
      ">

        {value}

      </h2>

    </div>
  );
}


function MiniMetric({
  label,
  value
}) {

  return (

    <div className="
      rounded-2xl
      bg-[#151821]
      border
      border-[#2A3142]
      p-4
    ">

      <p className="
        text-zinc-500
        text-xs
      ">

        {label}

      </p>

      <h3 className="
        text-2xl
        font-bold
        text-white
        mt-2
      ">

        {value}

      </h3>

    </div>
  );
}


function InfoRow({
  icon,
  label,
  value
}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      rounded-2xl
      bg-[#0F141D]
      border
      border-[#2A3142]
      px-5
      py-4
    ">

      <div className="
        flex
        items-center
        gap-3
        text-zinc-400
      ">

        {icon}

        <span>

          {label}

        </span>

      </div>

      <span className="
        text-white
        font-semibold
      ">

        {value || "-"}

      </span>

    </div>
  );
}


export default OrderDetailPage;
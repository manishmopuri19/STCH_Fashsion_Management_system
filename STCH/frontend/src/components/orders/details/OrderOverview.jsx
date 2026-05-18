// components/orders/details/OrderOverview.jsx

const formatMoney = (value) =>
  Number(value || 0).toFixed(2);


function OrderOverview({ order }) {

  return (

    <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
    ">

      {/* PO */}
      <ModernCard
        title="Purchase Order"
        glow="from-orange-500/20 to-red-500/10"
      >

        <Info
          label="PO Number"
          value={order?.po_number}
        />

        <Info
          label="Status"
          value={order?.status}
        />

        <Info
          label="Quantity"
          value={order?.quantity}
        />

        <Info
          label="Currency"
          value={order?.currency}
        />

        <Info
          label="Lead Time"
          value={
            order?.lead_time
              ? `${order.lead_time} Days`
              : "-"
          }
        />

        <Info
          label="Delivery Date"
          value={
            order?.delivery_date || "-"
          }
        />

      </ModernCard>


      {/* SUPPLIER */}
      <ModernCard
        title="Supplier"
        glow="from-blue-500/20 to-cyan-500/10"
      >

        <Info
          label="Company"
          value={
            order?.supplier
              ?.company_name
          }
        />

        <Info
          label="Email"
          value={
            order?.supplier
              ?.email
          }
        />

        <Info
          label="Supplier ID"
          value={
            order?.supplier?.id
          }
        />

        <Info
          label="Payment Terms"
          value={
            order?.payment_terms
          }
        />

      </ModernCard>


      {/* RFQ */}
      <ModernCard
        title="RFQ Details"
        glow="from-violet-500/20 to-pink-500/10"
      >

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
          label="RFQ ID"
          value={
            order?.rfq?.id
          }
        />

      </ModernCard>


      {/* COMMERCIALS */}
      <ModernCard
        title="Commercials"
        glow="from-emerald-500/20 to-green-500/10"
      >

        <MetricGrid>

          <Metric
            title="Target"
            value={`$${formatMoney(
              order?.commercials
                ?.target_price
            )}`}
          />

          <Metric
            title="Supplier"
            value={`$${formatMoney(
              order?.commercials
                ?.supplier_price
            )}`}
          />

          <Metric
            title="Margin"
            value={`${formatMoney(
              order?.commercials
                ?.margin
            )}%`}
          />

          <Metric
            title="Profit"
            value={`${formatMoney(
              order?.commercials
                ?.profitability
            )}%`}
          />

        </MetricGrid>

        <div className="
          mt-6
          rounded-2xl
          bg-gradient-to-r
          from-orange-500
          to-orange-400
          p-6
        ">

          <p className="
            text-sm
            text-orange-100
          ">

            Total Order Value

          </p>

          <h2 className="
            text-4xl
            font-bold
            text-white
            mt-2
          ">

            ${formatMoney(
              order?.commercials
                ?.total_amount
            )}

          </h2>

        </div>

      </ModernCard>

    </div>
  );
}


/* CARD */
function ModernCard({
  title,
  children,
  glow
}) {

  return (

    <div className={`
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-[#2A3142]
      bg-[#151821]
      p-8
      shadow-2xl
    `}>

      {/* GLOW */}
      <div className={`
        absolute
        inset-0
        bg-gradient-to-br
        ${glow}
        opacity-40
      `} />

      {/* CONTENT */}
      <div className="
        relative
        z-10
      ">

        <h2 className="
          text-2xl
          font-bold
          text-white
          mb-8
        ">

          {title}

        </h2>

        <div className="
          space-y-5
        ">

          {children}

        </div>

      </div>

    </div>
  );
}


/* INFO ROW */
function Info({
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

      <p className="
        text-zinc-500
        text-sm
      ">

        {label}

      </p>

      <p className="
        text-white
        font-semibold
        text-right
      ">

        {value || "-"}

      </p>

    </div>
  );
}


/* METRICS */
function MetricGrid({
  children
}) {

  return (

    <div className="
      grid
      grid-cols-2
      gap-4
    ">

      {children}

    </div>
  );
}


function Metric({
  title,
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

        {title}

      </p>

      <h3 className="
        text-2xl
        font-bold
        text-white
        mt-3
      ">

        {value}

      </h3>

    </div>
  );
}


export default OrderOverview;
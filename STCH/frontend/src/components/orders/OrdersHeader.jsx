import { PackageCheck } from "lucide-react";

function OrdersHeader({ total }) {

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-5
    ">

      {/* LEFT */}
      <div>

        <div className="
          flex
          items-center
          gap-4
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-gradient-to-br
            from-orange-500
            to-orange-400
            flex
            items-center
            justify-center
            shadow-lg
            shadow-orange-500/20
          ">

            <PackageCheck
              className="
                text-white
              "
              size={26}
            />

          </div>

          <div>

            <h1 className="text-lg font-semibold text-white">Purchase Orders</h1>
            <p className="text-zinc-500 text-xs mt-0.5">Manage sourcing & production workflow</p>

          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="
        px-6
        py-4
        rounded-2xl
        border
        border-[#2A3142]
        bg-[#151821]
      ">

        <p className="
          text-zinc-500
          text-sm
        ">
          Total Orders
        </p>

        <h2 className="
          text-3xl
          font-bold
          text-white
          mt-2
        ">
          {total}
        </h2>

      </div>

    </div>
  );
}

export default OrdersHeader;
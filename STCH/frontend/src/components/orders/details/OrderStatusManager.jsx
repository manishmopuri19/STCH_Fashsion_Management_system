// components/orders/details/OrderStatusManager.jsx

import API from "../../../api/axios";

const statuses = [

  "CREATED",

  "APPROVED",

  "IN_PRODUCTION",

  "SHIPPED",

  "DELIVERED"

];

function OrderStatusManager({
  order,
  refresh
}) {

  const updateStatus =
    async (status) => {

    try {

      await API.patch(
        `/purchase-orders/${order.id}/status`,
        { status }
      );

      refresh();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-3xl
      p-6
    ">

      <h2 className="
        text-2xl
        font-bold
        text-white
      ">

        Status Workflow

      </h2>

      <div className="
        mt-6
        space-y-3
      ">

        {statuses.map((status) => (

          <button

            key={status}

            onClick={() =>
              updateStatus(status)
            }

            className={`
              w-full
              py-4
              rounded-2xl
              transition-all

              ${order.status === status

                ? `
                  bg-orange-500
                  text-white
                `

                : `
                  bg-[#0F141D]
                  text-zinc-400
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
  );
}

export default OrderStatusManager;
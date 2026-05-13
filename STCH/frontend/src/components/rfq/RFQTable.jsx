import { useNavigate } from "react-router-dom";

function RFQTable({
  rfqs,
  loading
}) {

  const navigate = useNavigate();

  if (loading) {

    return (

      <div
        className="
          text-white
          text-lg
          py-10
        "
      >
        Loading RFQs...
      </div>

    );

  }

  if (!rfqs.length) {

    return (

      <div
        className="
          text-zinc-500
          text-lg
          py-10
        "
      >
        No RFQs Found
      </div>

    );

  }

  return (

    <div className="overflow-x-auto">

      <table className="w-full min-w-[1200px]">

        {/* TABLE HEADER */}
        <thead>

          <tr
            className="
              border-b
              border-[#2A3142]
              text-zinc-500
              text-sm
            "
          >

            <th className="text-left py-5">
              RFQ #
            </th>

            <th className="text-left py-5">
              Brand
            </th>

            <th className="text-left py-5">
              Garment
            </th>

            <th className="text-left py-5">
              Quantity
            </th>

            <th className="text-left py-5">
              Target Price
            </th>

            <th className="text-left py-5">
              Status
            </th>

            <th className="text-left py-5">
              Priority
            </th>

            <th className="text-left py-5">
              Delivery Date
            </th>

          </tr>

        </thead>

        {/* TABLE BODY */}
        <tbody>

          {rfqs.map((rfq) => (

            <tr

              key={rfq.id}

              onClick={() =>
                navigate(`/rfqs/${rfq.id}`)
              }

              className="
                border-b
                border-[#1D2230]
                hover:bg-[#151821]
                transition-all
                cursor-pointer
              "
            >

              {/* RFQ NUMBER */}
              <td
                className="
                  py-6
                  text-white
                  font-medium
                "
              >
                {rfq.rfq_number}
              </td>

              {/* BRAND */}
              <td className="text-zinc-300">

                {rfq.brand || "-"}

              </td>

              {/* GARMENT */}
              <td className="text-zinc-300">

                {rfq.garment_type || "-"}

              </td>

              {/* QUANTITY */}
              <td className="text-zinc-300">

                {rfq.quantity || "-"}

              </td>

              {/* TARGET PRICE */}
              <td className="text-zinc-300">

                ₹{rfq.target_price || 0}

              </td>

              {/* STATUS */}
              <td>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-orange-500/20
                    text-orange-400
                    text-sm
                    font-medium
                  "
                >
                  {rfq.status || "-"}
                </span>

              </td>

              {/* PRIORITY */}
              <td>

                <span
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-yellow-500/20
                    text-yellow-400
                    text-sm
                    font-medium
                  "
                >
                  {rfq.priority || "-"}
                </span>

              </td>

              {/* DELIVERY DATE */}
              <td className="text-zinc-400">

                {rfq.delivery_date || "-"}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default RFQTable;
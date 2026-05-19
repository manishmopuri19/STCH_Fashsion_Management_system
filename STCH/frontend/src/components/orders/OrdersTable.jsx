import { useNavigate }
from "react-router-dom";

const formatMoney = (value) =>
  Number(value || 0).toFixed(2);

function OrdersTable({
  orders,
  loading
}) {

  const navigate = useNavigate();

  if (loading) {

    return (
      <div className="
        text-white
      ">
        Loading...
      </div>
    );
  }

  return (

    <div className="
      overflow-hidden
      rounded-3xl
      border
      border-[#2A3142]
    ">

      <table className="w-full">

        <thead className="
          bg-[#151821]
        ">

          <tr>

            <Th>PO Number</Th>

            <Th>Status</Th>

            <Th>Total Amount</Th>

            <Th>Margin</Th>

            <Th>Lead Time</Th>

          </tr>

        </thead>

        <tbody>

          {orders.map((po) => (

            <tr

              key={po.id}

              onClick={() =>
                navigate(
                  `/orders/${po.id}`
                )
              }

              className="
                border-t
                border-[#2A3142]
                bg-[#0F141D]
                hover:bg-[#151821]
                cursor-pointer
              "
            >

              <Td>{po.po_number}</Td>

              <Td>{po.status}</Td>

              <Td>
                {po.currency} {formatMoney(
                  po.total_amount
                )}
              </Td>

              <Td>
                {formatMoney(
                  po.margin
                )}%
              </Td>

              <Td>
                {po.lead_time} Days
              </Td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

function Th({ children }) {
  return (
    <th className="
      text-left
      px-6
      py-4
      text-zinc-500
    ">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="
      px-6
      py-5
      text-white
    ">
      {children}
    </td>
  );
}

export default OrdersTable;
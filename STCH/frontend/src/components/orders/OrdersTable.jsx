import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  CREATED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  APPROVED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  IN_PRODUCTION: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  SHIPPED: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DELIVERED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/20",
};

function OrdersTable({ orders, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-zinc-500 text-sm py-8">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#2A3142]">
      <table className="w-full">
        <thead className="bg-[#151821]">
          <tr>
            <Th>PO Number</Th>
            <Th>Brand</Th>
            <Th>Garment</Th>
            <Th>Quantity</Th>
            <Th>Delivery Date</Th>
            <Th>Lead Time</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((po) => (
            <tr
              key={po.id}
              onClick={() => navigate(`/orders/${po.id}`)}
              className="border-t border-[#2A3142] bg-[#0F141D] hover:bg-[#151821] cursor-pointer transition-all"
            >
              <Td>
                <span className="font-bold text-white">{po.po_number}</span>
              </Td>
              <Td>{po.brand || "—"}</Td>
              <Td>{po.garment_type || "—"}</Td>
              <Td>{po.quantity ? `${po.quantity} pcs` : "—"}</Td>
              <Td>{po.delivery_date || "—"}</Td>
              <Td>{po.lead_time ? `${po.lead_time} days` : "—"}</Td>
              <Td>
                <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_STYLES[po.status] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`}>
                  {po.status?.replaceAll("_", " ") || "—"}
                </span>
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
    <th className="text-left px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="px-6 py-5 text-zinc-300 text-sm">
      {children}
    </td>
  );
}

export default OrdersTable;

import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  NEW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  QUOTED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  APPROVED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
  PO_CREATED: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CLOSED: "text-zinc-500 bg-zinc-700/10 border-zinc-700/20",
};

const PRIORITY_STYLES = {
  LOW: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  MEDIUM: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20",
};

function RFQTable({ rfqs, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-zinc-500 text-sm py-10">Loading RFQs...</div>;
  }

  if (!rfqs.length) {
    return <div className="text-zinc-500 text-sm py-10">No RFQs found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        <thead>
          <tr className="border-b border-[#2A3142]">
            <Th>RFQ #</Th>
            <Th>Brand</Th>
            <Th>Garment</Th>
            <Th>Quantity</Th>
            <Th>Status</Th>
            <Th>Priority</Th>
            <Th>Delivery Date</Th>
          </tr>
        </thead>
        <tbody>
          {rfqs.map((rfq) => (
            <tr
              key={rfq.id}
              onClick={() => navigate(`/rfqs/${rfq.id}`)}
              className="border-b border-[#1D2230] hover:bg-[#151821] transition-all cursor-pointer"
            >
              <td className="py-5 text-white font-bold text-sm">
                {rfq.rfq_number}
              </td>
              <td className="py-5 text-zinc-300 text-sm">{rfq.brand || "—"}</td>
              <td className="py-5 text-zinc-300 text-sm">{rfq.garment_type || "—"}</td>
              <td className="py-5 text-zinc-300 text-sm">{rfq.quantity || "—"}</td>
              <td className="py-5">
                <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${STATUS_STYLES[rfq.status] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`}>
                  {rfq.status?.replaceAll("_", " ") || "—"}
                </span>
              </td>
              <td className="py-5">
                <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${PRIORITY_STYLES[rfq.priority] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"}`}>
                  {rfq.priority || "—"}
                </span>
              </td>
              <td className="py-5 text-zinc-400 text-sm">{rfq.delivery_date || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left py-4 text-zinc-500 text-xs font-bold uppercase tracking-wider">
      {children}
    </th>
  );
}

export default RFQTable;

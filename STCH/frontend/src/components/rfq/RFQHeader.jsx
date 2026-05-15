import { useNavigate } from "react-router-dom";

const RFQHeader = ({ total }) => {
  const navigate = useNavigate();
  
  // 1. Get raw data
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // 2. Debugging: This will tell you exactly why the button is showing
  console.log("Current User Role:", user?.role);

  // 3. Strict Check: Only show if role is explicitly ADMIN or MERCHANDISER
  // We use .toUpperCase() to prevent casing issues
  const role = user?.role?.toUpperCase();
  const canCreate = role === "ADMIN" || role === "MERCHANDISER";

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">RFQ Pipeline</h1>
        <p className="text-zinc-500 text-sm mt-1">Total RFQs: {total}</p>
      </div>

      {canCreate && (
        <button
          onClick={() => navigate("/rfqs/create")}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-orange-500/20"
        >
          + Add RFQ
        </button>
      )}
    </div>
  );
};

export default RFQHeader;
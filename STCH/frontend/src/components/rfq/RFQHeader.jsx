import { useNavigate } from "react-router-dom";

function RFQHeader({ total }) {

  const navigate = useNavigate();

  return (

    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
      "
    >

      <div>

        <div className="flex items-center gap-4">

          <h1
            className="
              text-4xl
              font-semibold
              text-white
              tracking-tight
            "
          >
            RFQ Pipeline
          </h1>

          <div
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
            {total} RFQs
          </div>

        </div>

        <p className="text-zinc-500 mt-2">
          Manage all requests for quotation.
        </p>

      </div>

      <button
        onClick={() => navigate("/rfqs/create")}
        className="
          px-6
          py-3
          rounded-2xl
          bg-orange-500
          hover:bg-orange-400
          text-white
          font-medium
          transition-all
          duration-300
        "
      >
        + New RFQ
      </button>

    </div>

  );
}

export default RFQHeader;
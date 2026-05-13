import { useMemo } from "react";

import {
  RFQ_STATUSES
} from "../../constants/rfqStatuses";

function RFQPipeline({

  rfqs,

  activeStatus,

  setActiveStatus

}) {

  const statusCounts = useMemo(() => {

    return rfqs.reduce((acc, rfq) => {

      const status = rfq.status;

      acc[status] = (acc[status] || 0) + 1;

      return acc;

    }, {});

  }, [rfqs]);

  return (

    <div
      className="
        flex
        gap-3
        overflow-x-auto
        pb-2
      "
    >

      {/* ALL */}
      <button

        onClick={() =>
          setActiveStatus("ALL")
        }

        className={`
          flex
          items-center
          gap-3
          px-4
          py-3
          rounded-full
          border
          whitespace-nowrap
          transition-all

          ${
            activeStatus === "ALL"
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-[#1A1F2B] border-[#2A3142] text-zinc-300"
          }
        `}
      >

        <span>All</span>

        <span
          className="
            text-xs
            px-2
            py-1
            rounded-full
            bg-black/20
          "
        >
          {rfqs.length}
        </span>

      </button>

      {/* STATUS ITEMS */}
      {RFQ_STATUSES.map((status) => {

        const active =
          activeStatus === status.key;

        return (

          <button
            key={status.key}

            onClick={() =>
              setActiveStatus(
                active
                  ? "ALL"
                  : status.key
              )
            }

            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-full
              border
              whitespace-nowrap
              transition-all

              ${
                active
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-[#1A1F2B] border-[#2A3142] text-zinc-300 hover:border-orange-400"
              }
            `}
          >

            <div
              className={`
                w-2.5
                h-2.5
                rounded-full
                ${status.color}
              `}
            />

            <span className="text-sm">
              {status.label}
            </span>

            <span
              className="
                text-xs
                px-2
                py-1
                rounded-full
                bg-black/20
              "
            >
              {statusCounts[status.key] || 0}
            </span>

          </button>

        );

      })}

    </div>

  );
}

export default RFQPipeline;
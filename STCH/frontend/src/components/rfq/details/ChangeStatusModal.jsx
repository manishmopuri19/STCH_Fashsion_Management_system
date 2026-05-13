import {
  RFQ_STATUSES
} from "../../constants/rfqStatuses";

function ChangeStatusModal({
  rfq,
  onClose
}) {

  return (

    <div className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        w-[500px]
        bg-[#121826]
        rounded-2xl
        border
        border-[#1D2230]
        p-8
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <h2 className="
            text-2xl
            text-white
            font-semibold
          ">
            Update RFQ Status
          </h2>

          <button
            onClick={onClose}
            className="
              text-zinc-400
              text-2xl
            "
          >
            ×
          </button>

        </div>

        <div className="space-y-4">

          {
            RFQ_STATUSES.map((status) => (

              <div

                key={status}

                className={`
                  p-5
                  rounded-xl
                  border
                  cursor-pointer
                  transition-all

                  ${
                    rfq.status === status
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-[#2A3142]"
                  }
                `}
              >

                <p className="text-white">

                  {status}

                </p>

              </div>

            ))
          }

        </div>

      </div>

    </div>

  );

}

export default ChangeStatusModal;
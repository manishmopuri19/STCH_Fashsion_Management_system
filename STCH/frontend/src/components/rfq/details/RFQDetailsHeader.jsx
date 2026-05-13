function RFQDetailsHeader({ rfq }) {

  return (

    <div
      className="
        flex
        justify-between
        items-start
      "
    >

      <div>

        <h1
          className="
            text-4xl
            font-semibold
            text-white
          "
        >
          {rfq.rfq_number}
        </h1>

        <p className="
          text-zinc-500
          mt-2
        ">
          Created RFQ Workspace
        </p>

      </div>

      <div className="
        flex
        gap-3
      ">

        <button
          className="
            px-5
            py-3
            rounded-2xl
            bg-orange-500
            text-white
          "
        >
          Actions
        </button>

        <button
          className="
            px-5
            py-3
            rounded-2xl
            border
            border-[#2A3142]
            text-white
          "
        >
          Change Status
        </button>

        <button
          className="
            px-5
            py-3
            rounded-2xl
            border
            border-[#2A3142]
            text-white
          "
        >
          + Collaborator
        </button>

      </div>

    </div>

  );
}

export default RFQDetailsHeader;
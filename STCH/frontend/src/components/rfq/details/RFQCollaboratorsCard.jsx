function RFQCollaboratorsCard() {

  return (

    <div
      className="
        bg-[#11151D]
        border
        border-[#2A3142]
        rounded-3xl
        p-6
      "
    >

      <div className="
        flex
        justify-between
        mb-6
      ">

        <h2 className="
          text-white
          text-xl
          font-semibold
        ">
          Collaborators
        </h2>

        <button
          className="
            text-orange-400
          "
        >
          Manage
        </button>

      </div>

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-full
            bg-orange-500
            flex
            items-center
            justify-center
            text-white
            font-semibold
          "
        >
          A
        </div>

        <div>

          <p className="text-white">
            Admin
          </p>

          <p className="
            text-zinc-500
            text-sm
          ">
            OWNER
          </p>

        </div>

      </div>

    </div>

  );
}

export default RFQCollaboratorsCard;
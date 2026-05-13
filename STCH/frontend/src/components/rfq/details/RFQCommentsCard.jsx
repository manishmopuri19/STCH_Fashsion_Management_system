function RFQCommentsCard() {

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

      <h2
        className="
          text-white
          text-xl
          font-semibold
          mb-6
        "
      >
        Comments
      </h2>

      <textarea
        placeholder="Add comment..."
        className="
          w-full
          h-32
          bg-[#1A1F2B]
          border
          border-[#2A3142]
          rounded-2xl
          p-4
          text-white
          resize-none
          outline-none
        "
      />

      <button
        className="
          mt-4
          px-5
          py-3
          rounded-2xl
          bg-orange-500
          text-white
        "
      >
        Post Comment
      </button>

    </div>

  );
}

export default RFQCommentsCard;
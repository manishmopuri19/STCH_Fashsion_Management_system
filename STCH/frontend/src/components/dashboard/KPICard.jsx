function KPICard({

  title,

  value,

  icon,

  color = "from-violet-500 to-blue-500"
}) {

  return (

    <div className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-[#2A3142]
      bg-[#151821]
      p-6
    ">

      <div className={`
        absolute
        inset-0
        opacity-10
        bg-gradient-to-br
        ${color}
      `} />

      <div className="
        relative
        z-10
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          <div>

            <p className="
              text-sm
              text-zinc-500
            ">
              {title}
            </p>

            <h2 className="
              text-4xl
              font-bold
              text-white
              mt-3
            ">
              {value}
            </h2>

          </div>

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-white/10
            flex
            items-center
            justify-center
            text-white
          ">
            {icon}
          </div>

        </div>

      </div>

    </div>
  );
}

export default KPICard;
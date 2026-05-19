import {
  ShieldX,
  DatabaseZap
} from "lucide-react";


function EmptyState({

  title = "No Data Found",

  description =
    "Nothing available here.",

  unauthorized = false
}) {

  return (

    <div className="
      min-h-[400px]
      flex
      items-center
      justify-center
    ">

      <div className="
        text-center
        max-w-md
      ">

        <div className="
          mx-auto
          w-20
          h-20
          rounded-3xl
          bg-[#151821]
          border
          border-[#2A3142]
          flex
          items-center
          justify-center
          mb-6
        ">

          {unauthorized ? (

            <ShieldX
              size={34}
              className="
                text-red-400
              "
            />

          ) : (

            <DatabaseZap
              size={34}
              className="
                text-zinc-500
              "
            />

          )}

        </div>


        <h2 className="
          text-2xl
          font-bold
          text-white
          mb-3
        ">

          {title}

        </h2>


        <p className="
          text-zinc-500
          leading-relaxed
        ">

          {description}

        </p>

      </div>

    </div>
  );
}

export default EmptyState;
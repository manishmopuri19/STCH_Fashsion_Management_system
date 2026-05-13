import {
  Pencil
} from "lucide-react";

function RFQEditField({

  label,
  value

}) {

  return (

    <div>

      <div
        className="
          flex
          items-center
          gap-2
          mb-2
        "
      >

        <p className="
          text-zinc-500
          text-sm
        ">
          {label}
        </p>

        <button>

          <Pencil
            size={14}
            className="
              text-zinc-500
              hover:text-orange-400
            "
          />

        </button>

      </div>

      <p
        className="
          text-white
          text-lg
        "
      >
        {value || "-"}
      </p>

    </div>

  );
}

export default RFQEditField;
import { useState } from "react";

import API from "../../api/axios";


function GeneratePOStep({

  rfq,

  quotation,

  onBack,

  onSuccess
}) {

  const [loading, setLoading] =
    useState(false);


  const createPO = async () => {

    try {

      setLoading(true);

      await API.post(

        `/rfqs/${rfq.id}/convert-to-po`,

        {
          rfq_supplier_id:
            quotation.id
        }
      );

      onSuccess();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="space-y-6">

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-white
        ">
          Generate Purchase Order
        </h2>

        <p className="
          text-zinc-500
          mt-2
        ">
          Finalize sourcing workflow
        </p>

      </div>


      <div className="
        rounded-3xl
        bg-gradient-to-r
        from-violet-500/20
        to-blue-500/20
        border
        border-violet-500/30
        p-7
      ">

        <h2 className="
          text-3xl
          font-bold
          text-white
        ">

          Ready to Create PO

        </h2>

        <p className="
          text-zinc-300
          mt-3
          leading-relaxed
        ">

          Purchase order will be created
          using approved supplier quotation
          and TNA workflow will automatically
          initialize.

        </p>

      </div>


      <div className="
        flex
        gap-4
      ">

        <button

          onClick={onBack}

          className="
            flex-1
            py-4
            rounded-2xl
            bg-[#1A1F2B]
            text-white
          "
        >
          Back
        </button>

        <button

          onClick={createPO}

          disabled={loading}

          className="
            flex-1
            py-4
            rounded-2xl
            bg-violet-500
            hover:bg-violet-400
            transition-all
            text-white
            font-semibold
          "
        >

          {loading
            ? "Generating PO..."
            : "Generate Purchase Order"}

        </button>

      </div>

    </div>
  );
}

export default GeneratePOStep;
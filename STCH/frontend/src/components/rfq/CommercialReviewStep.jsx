function CommercialReviewStep({

  rfq,

  quotation,

  onBack,

  onNext
}) {

  const supplierPrice =
    quotation.quoted_price;

  const targetPrice =
    rfq.target_price;

  const margin =
    targetPrice - supplierPrice;

  const profitability =
    (
      (margin / targetPrice)
      * 100
    ).toFixed(2);

  const totalAmount =
    supplierPrice *
    rfq.quantity;


  return (

    <div className="space-y-6">

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-white
        ">
          Commercial Review
        </h2>

        <p className="
          text-zinc-500
          mt-2
        ">
          Verify profitability and commercials
        </p>

      </div>


      <div className="
        grid
        grid-cols-2
        gap-5
      ">

        <Card
          title="Target Price"
          value={`${rfq.currency} ${targetPrice}`}
        />

        <Card
          title="Supplier Price"
          value={`${rfq.currency} ${supplierPrice}`}
        />

        <Card
          title="Margin"
          value={`${rfq.currency} ${margin}`}
        />

        <Card
          title="Profitability"
          value={`${profitability}%`}
        />

      </div>


      <div className="
        rounded-3xl
        border
        border-violet-500/30
        bg-violet-500/10
        p-7
      ">

        <p className="
          text-sm
          text-violet-300
        ">
          Total Order Value
        </p>

        <h1 className="
          text-5xl
          font-bold
          text-white
          mt-2
        ">

          {rfq.currency}
          {totalAmount.toLocaleString()}

        </h1>

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

          onClick={onNext}

          className="
            flex-1
            py-4
            rounded-2xl
            bg-violet-500
            text-white
            font-semibold
          "
        >
          Approve & Continue
        </button>

      </div>

    </div>
  );
}


function Card({
  title,
  value
}) {

  return (

    <div className="
      bg-[#151821]
      border
      border-[#2A3142]
      rounded-2xl
      p-5
    ">

      <p className="
        text-sm
        text-zinc-500
      ">
        {title}
      </p>

      <h2 className="
        text-2xl
        font-bold
        text-white
        mt-3
      ">
        {value}
      </h2>

    </div>
  );
}

export default CommercialReviewStep;
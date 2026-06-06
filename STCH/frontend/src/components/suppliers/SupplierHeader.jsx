function SupplierHeader({ total }) {

  return (

    <div className="
      flex
      items-center
      justify-between
    ">

      <div>

        <h1 className="text-lg font-semibold text-white">Suppliers</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Supplier sourcing network</p>

      </div>

      <div className="
        px-5
        py-3
        rounded-2xl
        bg-orange-500/10
        border
        border-orange-500/20
        text-orange-400
        font-semibold
      ">

        {total} Suppliers

      </div>

    </div>
  );
}

export default SupplierHeader;
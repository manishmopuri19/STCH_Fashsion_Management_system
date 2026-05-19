function RFQFilters({

  search,

  setSearch,

  statusFilter,

  setStatusFilter

}) {

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      gap-4
    ">

      {/* SEARCH */}
      <input

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

        placeholder="Search RFQs..."

        className="
          flex-1
          px-5
          py-4
          rounded-2xl
          bg-[#1A1F2B]
          border
          border-[#2A3142]
          text-white
          outline-none
        "
      />


      {/* STATUS FILTER */}
      <select

        value={statusFilter}

        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }

        className="
          w-full
          lg:w-[260px]
          px-5
          py-4
          rounded-2xl
          bg-[#1A1F2B]
          border
          border-[#2A3142]
          text-white
          outline-none
        "
      >

        <option value="ALL">All Statuses</option>
        <option value="NEW">NEW</option>
        <option value="CLIENT_REVIEW">CLIENT REVIEW</option>
        <option value="INTERNAL_COSTING">INTERNAL COSTING</option>
        <option value="SUPPLIER_MATCHING">SUPPLIER MATCHING</option>
        <option value="SAMPLING">SAMPLING</option>
        <option value="NEGOTIATION">NEGOTIATION</option>
        <option value="ORDER_CONFIRMED">ORDER CONFIRMED</option>
        <option value="CREATED">PO CREATED</option>
        <option value="PRODUCTION">PRODUCTION</option>
        <option value="QC">QC</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>

      </select>

    </div>
  );
}

export default RFQFilters;

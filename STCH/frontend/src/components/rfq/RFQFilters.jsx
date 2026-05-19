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

        <option value="ALL">
          All Statuses
        </option>

        <option value="NEW">
          NEW
        </option>

        <option value="QUOTED">
          QUOTED
        </option>

        <option value="NEGOTIATION">
          NEGOTIATION
        </option>

        <option value="APPROVED">
          APPROVED
        </option>

        <option value="PO_CREATED">
          PO CREATED
        </option>

        <option value="CANCELLED">
          CANCELLED
        </option>

      </select>

    </div>
  );
}

export default RFQFilters;
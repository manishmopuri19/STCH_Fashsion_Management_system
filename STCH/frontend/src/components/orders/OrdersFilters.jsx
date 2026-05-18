function OrdersFilters({

  search,

  setSearch,

  statusFilter,

  setStatusFilter

}) {

  const statuses = [

    "ALL",

    "CREATED",

    "APPROVED",

    "IN_PRODUCTION",

    "SHIPPED",

    "DELIVERED",

    "CANCELLED"

  ];

  return (

    <div className="
      flex
      flex-col
      lg:flex-row
      gap-4
    ">

      {/* SEARCH */}
      <input

        type="text"

        placeholder="
          Search purchase orders...
        "

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

        className="
          flex-1
          px-5
          py-4
          rounded-2xl
          bg-[#151821]
          border
          border-[#2A3142]
          text-white
          placeholder:text-zinc-500
          focus:outline-none
          focus:border-orange-500
          transition-all
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
          px-5
          py-4
          rounded-2xl
          bg-[#151821]
          border
          border-[#2A3142]
          text-white
          focus:outline-none
          focus:border-orange-500
          transition-all
        "
      >

        {statuses.map((status) => (

          <option

            key={status}

            value={status}

          >

            {status
              .replaceAll("_", " ")}

          </option>

        ))}

      </select>

    </div>
  );
}

export default OrdersFilters;
function SupplierFilters({

  search,

  setSearch,

  countryFilter,

  setCountryFilter,

  suppliers

}) {

  const countries = [
    "ALL",
    ...new Set(
      suppliers.map(
        (s) => s.country
      )
    )
  ];

  return (

    <div className="
      flex
      gap-4
    ">

      <input

        placeholder="
          Search suppliers...
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
        "
      />

      <select

        value={countryFilter}

        onChange={(e) =>
          setCountryFilter(
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
        "
      >

        {countries.map((country) => (

          <option
            key={country}
            value={country}
          >

            {country}

          </option>

        ))}

      </select>

    </div>
  );
}

export default SupplierFilters;
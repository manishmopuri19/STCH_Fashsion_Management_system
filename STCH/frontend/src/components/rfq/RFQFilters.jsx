function RFQFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 ">

      {/* SEARCH */}
      <input
        placeholder="Search RFQs..."
        className="flex-1 px-5 py-4 rounded-2xl bg-[#1A1F2B] border border-[#2A3142] text-white outline-none"/>

      {/* STATUS FILTER */}
      <select
        className=" w-full lg:w-[260px] px-5 py-4 rounded-2xl bg-[#1A1F2B] border border-[#2A3142] text-white outline-none">
        <option>All Statuses</option>
        <option>New RFQ</option>
        <option>Costing</option>
        <option>Supplier Matching</option>
        <option>Sampling</option>
      </select>

    </div>
  );
}

export default RFQFilters;
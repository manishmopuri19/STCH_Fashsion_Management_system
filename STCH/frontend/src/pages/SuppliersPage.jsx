import { useEffect, useMemo, useState } from "react";

import API from "../api/axios";

import DashboardLayout
from "../layouts/DashboardLayout";

import SupplierHeader
from "../components/suppliers/SupplierHeader";

import SupplierFilters
from "../components/suppliers/SupplierFilters";

import SupplierStats
from "../components/suppliers/SupplierStats";

import SupplierTable
from "../components/suppliers/SupplierTable";


function SuppliersList() {

  const [suppliers, setSuppliers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [countryFilter,
    setCountryFilter] =
    useState("ALL");


  useEffect(() => {

    fetchSuppliers();

  }, []);


  const fetchSuppliers = async () => {

    try {

      const response =
        await API.get("/suppliers");

      setSuppliers(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  const filteredSuppliers =
    useMemo(() => {

    return suppliers.filter(
      (supplier) => {

      const matchesSearch =

        supplier.company_name
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        supplier.contact_person
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        supplier.specialization
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCountry =

        countryFilter === "ALL"

        ||

        supplier.country ===
        countryFilter;

      return (
        matchesSearch &&
        matchesCountry
      );

    });

  }, [
    suppliers,
    search,
    countryFilter
  ]);


  return (

    <DashboardLayout>

      <div className="
        space-y-8
      ">

        <SupplierHeader
          total={suppliers.length}
        />

        <div className="
          bg-[#11151D]
          border
          border-[#2A3142]
          rounded-3xl
          p-6
          space-y-6
        ">

          <SupplierFilters

            search={search}

            setSearch={setSearch}

            countryFilter={
              countryFilter
            }

            setCountryFilter={
              setCountryFilter
            }

            suppliers={suppliers}
          />

          <SupplierStats
            suppliers={suppliers}
          />

          <SupplierTable

            suppliers={
              filteredSuppliers
            }

            loading={loading}
          />

        </div>

      </div>

    </DashboardLayout>
  );
}

export default SuppliersList;
import { useEffect, useMemo, useState } from "react";

import API from "../../api/axios";

import DashboardLayout from "../../layouts/DashboardLayout";

import RFQHeader from "../../components/rfq/RFQHeader";
import RFQFilters from "../../components/rfq/RFQFilters";
import RFQPipeline from "../../components/rfq/RFQPipeline";
import RFQTable from "../../components/rfq/RFQTable";

function RFQList() {

  const [rfqs, setRfqs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  useEffect(() => {

    fetchRFQs();

  }, []);

  const fetchRFQs = async () => {

    try {

      const response =
        await API.get("/rfqs");

      setRfqs(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  // FILTERED RFQS
  const filteredRFQs = useMemo(() => {

    return rfqs.filter((rfq) => {

    const query =
  search.toLowerCase();

const matchesSearch =

  (rfq.rfq_number || "")
    .toLowerCase()
    .includes(query)

  ||

  (rfq.brand || "")
    .toLowerCase()
    .includes(query)

  ||

  (rfq.garment_type || "")
    .toLowerCase()
    .includes(query);

      const matchesStatus =

        statusFilter === "ALL"

        ||

        rfq.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [rfqs, search, statusFilter]);

  return (

    <DashboardLayout>

      <div className="space-y-8">

        <RFQHeader
          total={rfqs.length}
        />

        <div
          className="
            bg-[#11151D]
            border
            border-[#2A3142]
            rounded-3xl
            p-6
            space-y-6
          "
        >

          <RFQFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <RFQPipeline
            rfqs={rfqs}
            activeStatus={statusFilter}
            setActiveStatus={setStatusFilter}
          />

          <RFQTable
            rfqs={filteredRFQs}
            loading={loading}
          />

        </div>

      </div>

    </DashboardLayout>

  );
}

export default RFQList;
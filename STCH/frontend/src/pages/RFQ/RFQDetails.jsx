import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import API from "../../api/axios";

import DashboardLayout
from "../../layouts/DashboardLayout";

import RFQDetailsHeader
from "../../components/rfq/details/RFQDetailsHeader";

import RFQSummaryCard
from "../../components/rfq/details/RFQSummaryCard";

import RFQFabricCard
from "../../components/rfq/details/RFQFabricCard";

import RFQOrderCard
from "../../components/rfq/details/RFQOrderCard";

import RFQCollaboratorsCard
from "../../components/rfq/details/RFQCollaboratorsCard";

import RFQCommentsCard
from "../../components/rfq/details/RFQCommentsCard";

function RFQDetails() {

  const { rfqId } = useParams();

  const [rfq, setRfq] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchRFQ();

  }, []);

  const fetchRFQ = async () => {

    try {

      const response =
        await API.get(`/rfq/${rfqId}`);

      setRfq(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div className="text-white">
        Loading...
      </div>
    );

  }

  return (

    <DashboardLayout>

      <div className="
        grid
        grid-cols-12
        gap-6
      ">

        {/* LEFT */}
        <div className="
          col-span-12
          xl:col-span-8
          space-y-6
        ">

          <RFQDetailsHeader
            rfq={rfq}
          />

          <RFQSummaryCard
            rfq={rfq}
          />

          <RFQFabricCard
            rfq={rfq}
          />

          <RFQOrderCard
            rfq={rfq}
          />

        </div>

        {/* RIGHT */}
        <div className="
          col-span-12
          xl:col-span-4
          space-y-6
        ">

          <RFQCollaboratorsCard
            rfqId={rfq.id}
          />

          <RFQCommentsCard
            rfqId={rfq.id}
          />

        </div>

      </div>

    </DashboardLayout>

  );
}

export default RFQDetails;
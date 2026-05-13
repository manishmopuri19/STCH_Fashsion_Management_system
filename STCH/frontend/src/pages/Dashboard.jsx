import DashboardLayout from "../layouts/DashboardLayout";

import StatsGrid from "../components/dashboard/StatsGrid";

import PipelineSection from "../components/dashboard/PipelineSection";

import ActivityFeed from "../components/dashboard/ActivityFeed";

import { useDashboardData } from "../hooks/useDashboardData";

function Dashboard() {

  const {
    dashboardData,
    loading,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout>

      <StatsGrid
        stats={dashboardData.statsData}
      />

      <PipelineSection
        title="RFQ Pipeline"
        data={dashboardData.rfqPipeline}
      />

      <PipelineSection
        title="Order Pipeline"
        data={dashboardData.orderPipeline}
      />

      <ActivityFeed
        activities={dashboardData.activities}
      />

    </DashboardLayout>
  );
}

export default Dashboard;
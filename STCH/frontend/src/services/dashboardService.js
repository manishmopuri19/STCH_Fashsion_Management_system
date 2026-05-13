import {
  statsData,
  rfqPipeline,
  orderPipeline,
  activities,
} from "../data/dashboardData";

export const getDashboardData = async () => {

  return {
    statsData,
    rfqPipeline,
    orderPipeline,
    activities,
  };
};
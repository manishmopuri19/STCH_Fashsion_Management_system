import { useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboardService";

export const useDashboardData = () => {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const data = await getDashboardData();

        setDashboardData(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchDashboard();

  }, []);

  return {
    dashboardData,
    loading,
  };
};
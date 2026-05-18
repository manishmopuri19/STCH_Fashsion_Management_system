import { useEffect, useMemo, useState }
from "react";

import API from "../../api/axios";

import DashboardLayout
from "../../layouts/DashboardLayout";

import OrdersHeader
from "../../components/orders/OrdersHeader";

import OrdersFilters
from "../../components/orders/OrdersFilters";

import OrdersStats
from "../../components/orders/OrdersStats";

import OrdersTable
from "../../components/orders/OrdersTable";


function OrdersList() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("ALL");


  useEffect(() => {

    fetchOrders();

  }, []);


  const fetchOrders = async () => {

    try {

      const response =
        await API.get(
          "/purchase-orders"
        );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  const filteredOrders =
    useMemo(() => {

    return orders.filter((po) => {

      const matchesSearch =

        po.po_number
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        po.currency
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =

        statusFilter === "ALL"

        ||

        po.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    orders,
    search,
    statusFilter
  ]);


  return (

    <DashboardLayout>

      <div className="
        space-y-8
      ">

        <OrdersHeader
          total={orders.length}
        />

        <div className="
          bg-[#11151D]
          border
          border-[#2A3142]
          rounded-3xl
          p-6
          space-y-6
        ">

          <OrdersFilters

            search={search}

            setSearch={setSearch}

            statusFilter={
              statusFilter
            }

            setStatusFilter={
              setStatusFilter
            }

          />

          <OrdersStats
            orders={orders}
          />

          <OrdersTable

            orders={
              filteredOrders
            }

            loading={loading}
          />

        </div>

      </div>

    </DashboardLayout>
  );
}

export default OrdersList;
import { useEffect, useMemo, useState }
from "react";

import API from "../../api/axios"

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

import EmptyState
from "../../components/common/EmptyState";


function OrdersList() {

  const [orders, setOrders] =useState([]);

  const [loading, setLoading] =useState(true);

  const [search, setSearch] =useState("");

  const [statusFilter,setStatusFilter] =useState("ALL");

  const [error, setError] =useState("");

  const [unauthorized,setUnauthorized] =useState(false);


  useEffect(() => {

    fetchOrders();

  }, []);


  const fetchOrders = async () => {

    try {

      setLoading(true);

      setError("");

      setUnauthorized(false);

      const response =
        await API.get(
          "/purchase-orders"
        );

      setOrders(
        response.data || []
      );

    } catch (error) {

      console.log(error);

      if (
        error?.response?.status === 403
      ) {

        setUnauthorized(true);

        setError(
          "You are not authorized to access these orders."
        );

      } else if (
        error?.response?.status === 404
      ) {

        setError("No orders found.");

      } else {
        setError("Failed to load orders.");
      }
    } 
    finally {
      setLoading(false);
    }
  };


  const filteredOrders =

    useMemo(() => {
      
      return orders.filter((po) => {

      const query =search.toLowerCase();

      const matchesSearch =(po.po_number || "").toLowerCase().includes(query)|| (po.currency || "").toLowerCase().includes(query) || (po.brand || "")
          .toLowerCase()
          .includes(query)

        ||

        (po.garment_type || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus = statusFilter === "ALL"|| po.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );

    });

  }, [
    orders,
    search,
    statusFilter
  ]);


  // LOADING STATE
  if (loading) {

    return (

      <DashboardLayout>

        <div className="
          min-h-[500px]
          flex
          items-center
          justify-center
        ">

          <div className="
            text-zinc-500
            text-sm
            animate-pulse
          ">

            Loading Orders...

          </div>

        </div>

      </DashboardLayout>
    );
  }


  // ERROR / UNAUTHORIZED
  if (error) {

    return (

      <DashboardLayout>

        <EmptyState

          unauthorized={
            unauthorized
          }

          title={
            unauthorized

            ? "Unauthorized Access"

            : "No Orders Found"
          }

          description={error}

        />

      </DashboardLayout>
    );
  }


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


          {!filteredOrders.length ? (

            <EmptyState

              title="
                No Orders Found
              "

              description="
                No purchase orders
                available for your account.
              "

            />

          ) : (

            <OrdersTable

              orders={
                filteredOrders
              }

              loading={loading}

            />

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default OrdersList;
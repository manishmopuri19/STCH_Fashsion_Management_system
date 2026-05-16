import { useAuth } from "../context/AuthContext";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import MerchDashboard from "../components/dashboard/MerchDashboard";
import SupplierDashboard from "../components/dashboard/SupplierDashboard";

function DashboardPage() {

  const { user } = useAuth();

  if(user?.role === "ADMIN"){

    return <AdminDashboard />;
  }

  if(user?.role === "MERCHANDISER"){

    return <MerchDashboard />;
  }

  if(user?.role === "SUPPLIER"){

    return <SupplierDashboard />;
  }

  return null;
}

export default DashboardPage;
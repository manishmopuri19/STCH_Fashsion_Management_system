import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import MerchDashboard from "../components/dashboard/MerchDashboard";
import SupplierDashboard from "../components/dashboard/SupplierDashboard";
import MemberDashboard from "../components/dashboard/MemberDashboard";

function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <AdminDashboard />;
  if (user?.role === "MERCHANDISER") return <MerchDashboard />;
  if (user?.role === "SUPPLIER") return <SupplierDashboard />;
  if (user?.role === "QC") return <MemberDashboard />;

  // MEMBER and any other authenticated role
  return <MemberDashboard />;
}

export default DashboardPage;

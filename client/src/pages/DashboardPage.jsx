import { useAuth } from "../context/AuthContext";
import FullPageSpinner from "../components/FullPageSpinner";
import GuestDashboard from "../components/GuestDashboard";
import HostDashboard from "../components/HostDashboard";
import DriverDashboard from "../components/DriverDashboard";
import AdminDashboard from "../components/AdminDashboard";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSpinner message="Loading dashboard..." />;
  if (!user) return null;

  switch (user.primaryRole) {
    case "host":
      return <HostDashboard />;
    case "driver":
      return <DriverDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "user":
    case "guest":
    default:
      return <GuestDashboard />;
  }
};

export default DashboardPage;

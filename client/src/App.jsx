import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import ListingsPage from "./pages/ListingsPage";
import HostDashboard from "./pages/HostDashboard";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ListingDetailPage from "./pages/ListingDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import HostListingBookingsPage from "./pages/HostListingBookingPage";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} /> {/* ✅ Fix this line */}
          <Route path="listings" element={<ListingsPage />} />
          <Route
            path="host/dashboard"
            element={
              <ProtectedRoute requiredRole="host">
                <HostDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/create"
            element={
              <ProtectedRoute requiredRole="host">
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="host/edit/:id"
            element={
              <ProtectedRoute requiredRole="host">
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/:id/bookings"
            element={<HostListingBookingsPage />}
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

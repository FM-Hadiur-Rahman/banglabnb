import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import VerifyNotice from "./pages/VerifyNotice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminListings from "./pages/AdminListings";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import DashboardBookings from "./pages/DashboardBookings";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
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
          <Route path="/register" element={<RegisterStep1 />} />
          <Route path="/register/step2" element={<RegisterStep2 />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify" element={<VerifyNotice />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/bookings" element={<DashboardBookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

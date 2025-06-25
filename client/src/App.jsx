import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// General Pages
import Home from "./pages/Home";
import ListingsPage from "./pages/ListingsPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import VerifyNotice from "./pages/VerifyNotice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HelpCenterPage from "./pages/HelpCenterPage";
import ContactUsPage from "./pages/ContactUsPage";
import MyWishlistPage from "./pages/MyWishlistPage";
import VerifyPhonePage from "./pages/VerifyPhone";

// User Dashboard
import DashboardPage from "./pages/DashboardPage";
import DashboardBookings from "./pages/DashboardBookings";
import EditProfilePage from "./pages/EditProfilePage";
import MyAccountPage from "./pages/MyAccoountPage";
import GuestChatsRoute from "./routes/GuestChatsRoute";
import HostChatsRoute from "./routes/HostChatsRoute";
import Notifications from "./components/Notifications";

// Payment Pages
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailPage from "./pages/PaymentFailPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";

// Host Pages
import HostDashboard from "./pages/HostDashboard";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import HostListingBookingsPage from "./pages/HostListingBookingPage";
import HostBlockedDates from "./components/HostBlockDates";

//Driver Pages
import DriverTripForm from "./pages/DriverTripForm";
import TripSearchPage from "./pages/TripSearchPage";
import DriverDashboard from "./pages/DriverDashboard";

// Booking Pages
import MyBookingsPage from "./pages/MyBookingsPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminListings from "./pages/AdminListings";
import AdminBookings from "./pages/AdminBookings";
import AdminKYC from "./pages/AdminKYC";
import AdminUserBreakdown from "./pages/AdminUserBreakdown";
import AdminFlagged from "./pages/AdminFlagged";
import AdminRevenue from "./pages/AdminRevenue";
import AdminPayouts from "./pages/AdminPayouts";
import AdminRefundsPage from "./pages/AdminRefundsPage";
import ReviewPage from "./pages/ReviewPage";
import AdminOverduePayouts from "./pages/AdminOverduePayouts";
import AdminPromocodes from "./pages/AdminPromocodes";

import TripDetailPage from "./pages/TripDetailPage";
import TripPaymentSuccess from "./pages/TripPaymentSuccess";
import AdminBanners from "./pages/AdminBanners";
import TermsPage from "./components/TermsPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import RefundPolicy from "./components/RefundPolicy";
import AdminLogs from "./pages/adminLogs";
import EmergencyInfoPage from "./pages/EmergencyInfoPage";
import AdminReferrals from "./pages/AdminReferrals";
import MyReferralsPage from "./pages/MyReferralPage";

function App() {
  return (
    <Router>
      <ToastContainer position="top-left" autoClose={3000} />
      <Routes>
        {/* Main Layout Wrapper */}
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listings/:id" element={<ListingDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterStep1 />} />
          <Route path="register/step2" element={<RegisterStep2 />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/emergency" element={<EmergencyInfoPage />} />
          <Route
            path="/resend-verification"
            element={<ResendVerificationPage />}
          />
          <Route path="verify" element={<VerifyNotice />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="help" element={<HelpCenterPage />} />
          <Route path="contact" element={<ContactUsPage />} />
          {/* Payment Results */}
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-fail" element={<PaymentFailPage />} />
          <Route path="payment-cancel" element={<PaymentCancelPage />} />
          {/* Guest/User Protected Routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/bookings"
            element={
              <ProtectedRoute>
                <DashboardBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reviews"
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-account"
            element={
              <ProtectedRoute>
                <MyAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/chats"
            element={
              <ProtectedRoute>
                <GuestChatsRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/host/chats"
            element={
              <ProtectedRoute requiredRole="host">
                <HostChatsRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <MyWishlistPage />
              </ProtectedRoute>
            }
          />
          {/* Host Protected Routes */}
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
          <Route
            path="host/listings/:id/bookings"
            element={
              <ProtectedRoute requiredRole="host">
                <HostListingBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/:id/blocked-dates"
            element={
              <ProtectedRoute requiredRole="host">
                <HostBlockedDates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-referrals"
            element={
              <ProtectedRoute>
                <MyReferralsPage />
              </ProtectedRoute>
            }
          />
          {/* Admin Protected Routes */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/listings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/bookings"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/kyc"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminKYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/user-breakdown"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserBreakdown />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/flagged"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminFlagged />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/revenue"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRevenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payouts"
            element={
              <ProtectedRoute requiredRoleedRoles="admin">
                <AdminPayouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/refunds"
            element={
              <ProtectedRoute requiredRoleedRoles="admin">
                <AdminRefundsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payouts/overdue"
            element={
              <ProtectedRoute requiredRoleedRoles="admin">
                <AdminOverduePayouts />
              </ProtectedRoute>
            }
          />
          //Drivers Route
          <Route
            path="/dashboard/driver"
            element={
              <ProtectedRoute>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/promocodes" element={<AdminPromocodes />} />
          <Route
            path="/admin/referrals"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminReferrals />
              </ProtectedRoute>
            }
          />
          <Route path="/trip-search" element={<TripSearchPage />} />
          <Route
            path="/dashboard/driver/trips/new"
            element={
              <ProtectedRoute>
                <DriverTripForm />
              </ProtectedRoute>
            }
          />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route
            path="/trip-payment-success"
            element={<TripPaymentSuccess />}
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBanners />
              </ProtectedRoute>
            }
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

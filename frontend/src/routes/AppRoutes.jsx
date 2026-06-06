import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UpdateProfilePage from "../pages/profile/UpdateProfilePage";
import UploadAvatarPage from "../pages/profile/UploadAvatarPage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";

import NotesPage from "../pages/notes/NotesPage";
import ViewNotePage from "../pages/notes/ViewNotePage";

import GroupsPage from "../pages/groups/GroupsPage";
import GroupDetailsPage from "../pages/groups/GroupDetailsPage";
import GroupMembersPage from "../pages/groups/GroupMembersPage";
import GroupNotesPage from "../pages/groups/GroupNotesPage";
import InvitationsPage from "../pages/groups/InvitationsPage";
import SharedNotesPage from "../pages/groups/SharedNotesPage";

import NotificationsPage from "../pages/notifications/NotificationsPage";
import RemindersPage from "../pages/reminders/RemindersPage";

import PricingPage from "../pages/subscription/PricingPage";
import PaymentSuccessPage from "../pages/subscription/PaymentSuccessPage";
import PaymentCancelPage from "../pages/subscription/PaymentCancelPage";

import ReviewsPage from "../pages/reviews/ReviewsPage";
import ReportsPage from "../pages/reports/ReportsPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";
import AdminRemindersPage from "../pages/admin/AdminRemindersPage";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";

import AdminLayout from "../layouts/AdminLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* User Layout with Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/update" element={<UpdateProfilePage />} />
        <Route path="profile/avatar" element={<UploadAvatarPage />} />
        <Route path="profile/password" element={<ChangePasswordPage />} />

        <Route path="notes" element={<NotesPage />} />
        <Route path="notes/:id" element={<ViewNotePage />} />

        <Route path="groups" element={<GroupsPage />} />
        <Route path="groups/:id" element={<GroupDetailsPage />} />
        <Route path="groups/:id/members" element={<GroupMembersPage />} />
        <Route path="groups/:id/notes" element={<GroupNotesPage />} />

        <Route path="invitations" element={<InvitationsPage />} />
        <Route path="shared-notes" element={<SharedNotesPage />} />

        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reminders" element={<RemindersPage />} />

        <Route path="pricing" element={<PricingPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="payment-cancel" element={<PaymentCancelPage />} />

        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="users" element={<AdminUsersPage />} />

        <Route path="reviews" element={<AdminReviewsPage />} />

        <Route path="reminders" element={<AdminRemindersPage />} />

        <Route path="notifications" element={<AdminNotificationsPage />} />

        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
}

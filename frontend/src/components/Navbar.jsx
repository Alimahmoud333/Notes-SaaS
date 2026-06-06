import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import { useNotification } from "../context/NotificationContext";

export default function Navbar({ profile }) {
  const { unreadCount } = useNotification();

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm sticky-top"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        zIndex: 1050,
      }}>
      <div className="container-fluid text-white">
        {/* Mobile Sidebar Button */}
        <button
          className="btn btn-light d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar">
          ☰
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="navbar-brand fw-bold text-white">
          Notes App
        </Link>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3 ms-auto">
          {/* Upgrade */}
          <Link to="/pricing" className="btn btn-warning fw-bold">
            🚀 Upgrade
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="btn btn-light position-relative rounded-circle"
            style={{ width: "40px", height: "40px" }}>
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Avatar */}
          {profile && (
            <Link to="/profile">
              <img
                src={
                  profile.avatar
                    ? `http://127.0.0.1:8000/storage/${profile.avatar}`
                    : "https://placehold.co/150"
                }
                alt="User Avatar"
                width="40"
                height="40"
                className="rounded-circle border border-light shadow-sm"
              />
            </Link>
          )}

          {/* User Menu */}
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{
          width: "260px",
          minHeight: "100vh",
        }}>
        <h4 className="mb-4">Admin Panel</h4>

        <div className="mb-3">
          <small className="text-light">Welcome {user?.name}</small>
        </div>

        <div className="d-grid gap-2">
          <Link to="/admin/dashboard" className="btn btn-outline-light">
            Dashboard
          </Link>

          <Link to="/admin/users" className="btn btn-outline-light">
            Users
          </Link>

          <Link to="/admin/reviews" className="btn btn-outline-light">
            Reviews
          </Link>

          <Link to="/admin/reminders" className="btn btn-outline-light">
            Reminders
          </Link>

          <Link to="/admin/notifications" className="btn btn-outline-light">
            Notifications
          </Link>

          <Link to="/admin/reports" className="btn btn-outline-light">
            Reports
          </Link>

          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#f8f9fa",
          minHeight: "100vh",
        }}>
        <Outlet />
      </div>
    </div>
  );
}

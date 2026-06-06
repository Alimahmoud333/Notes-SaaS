import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    notes: 0,
    groups: 0,
    notifications: 0,
    plan: "free",
    plan_expires_at: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await API.get("/dashboard");
      // ⚠️ هذا يفترض أن عندك API endpoint يرجع إحصائيات المستخدم
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-4">📊 Dashboard</h2>

      <div className="row g-4">
        {/* Notes */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5 className="fw-bold">📝 Notes</h5>
              <p className="display-6 fw-bold text-primary">{stats.notes}</p>
              <Link to="/notes" className="btn btn-outline-primary btn-sm">
                View Notes
              </Link>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5 className="fw-bold">👥 Groups</h5>
              <p className="display-6 fw-bold text-success">{stats.groups}</p>
              <Link to="/groups" className="btn btn-outline-success btn-sm">
                View Groups
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5 className="fw-bold">🔔 Notifications</h5>
              <p className="display-6 fw-bold text-danger">
                {stats.notifications}
              </p>
              <Link
                to="/notifications"
                className="btn btn-outline-danger btn-sm">
                View Notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center">
            <div className="card-body">
              <h5 className="fw-bold">💳 Subscription</h5>
              <p className="fw-bold text-muted mb-1">{stats.plan}</p>
              {stats.plan_expires_at ? (
                <small className="text-success">
                  Expires:{" "}
                  {new Date(stats.plan_expires_at).toLocaleDateString()}
                </small>
              ) : (
                <small className="text-danger">No active subscription</small>
              )}
              <div className="mt-2">
                <Link to="/pricing" className="btn btn-warning btn-sm">
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="card shadow mt-4 border-0">
        <div className="card-body">
          <h4 className="fw-bold">Welcome to Notes App </h4>
          <p className="text-muted">
            This is your personal dashboard. Here you can quickly access your
            notes, groups, notifications, and subscription details. Use the
            navigation above to explore more features.
          </p>
        </div>
      </div>
    </div>
  );
}

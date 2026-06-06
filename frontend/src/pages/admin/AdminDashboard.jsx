import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    notes: 0,
    groups: 0,
    reviews: 0,
    reports: 0,
    subscriptions: 0,
    pro_users: 0,
    free_users: 0,
    suspended_users: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const res = await API.get("/admin/dashboard");

      setStats(res.data.statistics);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-4">
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Users</h6>
              <h2>{stats.users}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Notes</h6>
              <h2>{stats.notes}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Groups</h6>
              <h2>{stats.groups}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Reviews</h6>
              <h2>{stats.reviews}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Reports</h6>
              <h2>{stats.reports}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Subscriptions</h6>
              <h2>{stats.subscriptions}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 bg-success text-white">
            <div className="card-body">
              <h6>Pro Users</h6>
              <h2>{stats.pro_users}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 bg-secondary text-white">
            <div className="card-body">
              <h6>Free Users</h6>
              <h2>{stats.free_users}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 bg-danger text-white">
            <div className="card-body">
              <h6>Suspended Users</h6>
              <h2>{stats.suspended_users}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-5">
        <div className="card-body">
          <h5 className="mb-3">System Overview</h5>

          <ul className="list-group">
            <li className="list-group-item">
              Total Users: <strong>{stats.users}</strong>
            </li>

            <li className="list-group-item">
              Total Notes: <strong>{stats.notes}</strong>
            </li>

            <li className="list-group-item">
              Total Groups: <strong>{stats.groups}</strong>
            </li>

            <li className="list-group-item">
              Total Reviews: <strong>{stats.reviews}</strong>
            </li>

            <li className="list-group-item">
              Total Reports: <strong>{stats.reports}</strong>
            </li>

            <li className="list-group-item">
              Active Subscriptions: <strong>{stats.subscriptions}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

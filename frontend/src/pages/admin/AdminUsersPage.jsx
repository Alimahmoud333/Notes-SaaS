import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function AdminUsersPage() {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers(page = 1, searchValue = search) {
    try {
      setLoading(true);

      const res = await API.get(
        `/admin/users?page=${page}&search=${searchValue}`,
      );

      setUsers(res.data.data);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      console.log(error);

      showToast("Failed to load users", "danger");
    } finally {
      setLoading(false);
    }
  }

  async function suspendUser(user) {
    if (!window.confirm(`Suspend ${user.name}?`)) return;

    try {
      const res = await API.post(`/admin/users/${user.id}/suspend`);

      showToast(res.data.message, "success");

      loadUsers(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed", "danger");
    }
  }

  async function unsuspendUser(user) {
    try {
      const res = await API.post(`/admin/users/${user.id}/unsuspend`);

      showToast(res.data.message, "success");

      loadUsers(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed", "danger");
    }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;

    try {
      const res = await API.delete(`/admin/users/${user.id}`);

      showToast(res.data.message, "success");

      loadUsers(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed", "danger");
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Users Management</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={() => loadUsers(1)}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="alert alert-info">No users found.</div>
      )}

      {!loading && users.length > 0 && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th width="280">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`badge ${
                          user.plan === "pro" ? "bg-success" : "bg-secondary"
                        }`}>
                        {user.plan}
                      </span>
                    </td>

                    <td>
                      {user.is_suspended ? (
                        <span className="badge bg-danger">Suspended</span>
                      ) : (
                        <span className="badge bg-success">Active</span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {user.is_suspended ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => unsuspendUser(user)}>
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => suspendUser(user)}>
                            Suspend
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteUser(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 mt-4">
        {Array.from({ length: pagination.last_page }, (_, i) => (
          <button
            key={i}
            className={`btn ${
              pagination.current_page === i + 1
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => loadUsers(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

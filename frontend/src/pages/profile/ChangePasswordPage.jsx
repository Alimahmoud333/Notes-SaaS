import { useState } from "react";
import API from "../../api/axios";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/change-password", form);
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h3 className="fw-bold text-danger mb-4">
            <i className="bi bi-lock-fill me-2"></i> Change Password
          </h3>
          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Current Password"
              onChange={(e) =>
                setForm({ ...form, current_password: e.target.value })
              }
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setForm({ ...form, new_password: e.target.value })
              }
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Confirm New Password"
              onChange={(e) =>
                setForm({
                  ...form,
                  new_password_confirmation: e.target.value,
                })
              }
            />
            <button className="btn btn-danger w-100">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function UpdateProfilePage() {
  const [name, setName] = useState("");
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/update-profile", { name });
      localStorage.setItem("profile", JSON.stringify(res.data.user));
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast("Update failed", "danger");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h3 className="fw-bold text-primary mb-4">
            <i className="bi bi-pencil-square me-2"></i> Update Profile
          </h3>
          <form onSubmit={submit}>
            <input
              className="form-control mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
            />
            <button className="btn btn-primary w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

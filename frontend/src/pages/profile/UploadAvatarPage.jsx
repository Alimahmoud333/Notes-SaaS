import { useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function UploadAvatarPage() {
  const [avatar, setAvatar] = useState(null);
  const { showToast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await API.post("/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profile = JSON.parse(localStorage.getItem("profile")) || {};
      profile.avatar = res.data.avatar;
      localStorage.setItem("profile", JSON.stringify(profile));
      showToast("Avatar updated successfully!", "success");
    } catch (error) {
      showToast("Upload failed", "danger");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h3 className="fw-bold text-success mb-4">
            <i className="bi bi-image me-2"></i> Upload Avatar
          </h3>
          <form onSubmit={submit}>
            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            <button className="btn btn-success w-100">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
}

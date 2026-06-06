import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProfile, useProfileDispatch } from "../../context/ProfileContext";

export default function ProfilePage() {
  const profile = useProfile();
  const { loadProfile } = useProfileDispatch();

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body text-center">
          {/* Avatar */}
          <img
            src={
              profile.avatar
                ? `http://127.0.0.1:8000/storage/${profile.avatar}`
                : "https://placehold.co/150"
            }
            alt="Avatar"
            width="150"
            height="150"
            className="rounded-circle mb-3 shadow-sm"
          />

          {/* Name & Email */}
          <h4 className="fw-bold text-primary">{profile.name}</h4>
          <p className="text-muted">{profile.email}</p>

          {/* Plan & Verification */}
          <div className="mb-3">
            <span className="badge bg-primary me-2">{profile.plan}</span>
            {profile.is_verified ? (
              <span className="badge bg-success">Verified</span>
            ) : (
              <span className="badge bg-danger">Not Verified</span>
            )}
          </div>

          {/* Action Icons */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/profile/update" className="btn btn-outline-primary">
              <i className="bi bi-pencil-square me-2"></i> Update Profile
            </Link>
            <Link to="/profile/avatar" className="btn btn-outline-success">
              <i className="bi bi-image me-2"></i> Upload Avatar
            </Link>
            <Link to="/profile/password" className="btn btn-outline-danger">
              <i className="bi bi-lock-fill me-2"></i> Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

export default function UserDropdown() {
  const profile = useProfile();

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarUrl = profile?.avatar
    ? `http://127.0.0.1:8000/storage/${profile.avatar}`
    : "https://placehold.co/40";

  return (
    <div className="dropdown">
      <button
        className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
        data-bs-toggle="dropdown">
        <img
          src={avatarUrl}
          alt="avatar"
          width="40"
          height="40"
          className="rounded-circle border"
        />

        <span className="fw-semibold">{profile?.name || "User"}</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end shadow">
        <li>
          <Link className="dropdown-item" to="/profile">
            👤 Profile
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/profile/update">
            ✏️ Update Profile
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/profile/avatar">
            🖼 Upload Avatar
          </Link>
        </li>

        <li>
          <Link className="dropdown-item" to="/profile/password">
            🔒 Change Password
          </Link>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

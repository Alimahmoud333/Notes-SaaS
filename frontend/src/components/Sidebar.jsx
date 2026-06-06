import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
     
      <div
        className="offcanvas offcanvas-start text-white"
        id="sidebar"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}>
        <div className="offcanvas-header">
          <h5 className="fw-bold">Menu</h5>
          <button
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          />
        </div>

        <div className="offcanvas-body overflow-auto">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/dashboard" className="nav-link text-white">
                <i className="bi bi-house me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/notes" className="nav-link text-white">
                <i className="bi bi-file-text me-2"></i> Notes
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/groups" className="nav-link text-white">
                <i className="bi bi-people me-2"></i> Groups
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reminders" className="nav-link text-white">
                <i className="bi bi-calendar-event me-2"></i> Reminders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/notifications" className="nav-link text-white">
                <i className="bi bi-bell me-2"></i> Notifications
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/profile" className="nav-link text-white">
                <i className="bi bi-person-circle me-2"></i> Profile
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/invitations" className="nav-link text-white">
                <i className="bi bi-envelope-paper me-2"></i> Invitations
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reviews" className="nav-link text-white">
                <i className="bi bi-star me-2"></i> Reviews
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reports" className="nav-link text-white">
                <i className="bi bi-flag me-2"></i> Reports
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Fixed Sidebar (Desktop) */}
      <div
        className="d-flex flex-column vh-100 p-3 text-white shadow position-fixed"
        style={{
          width: "240px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}>
        <h4 className="fw-bold mb-4">Menu</h4>
        <div className="flex-grow-1 overflow-auto">
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item mb-2">
              <Link to="/dashboard" className="nav-link text-white">
                <i className="bi bi-house me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/notes" className="nav-link text-white">
                <i className="bi bi-file-text me-2"></i> Notes
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/groups" className="nav-link text-white">
                <i className="bi bi-people me-2"></i> Groups
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reminders" className="nav-link text-white">
                <i className="bi bi-calendar-event me-2"></i> Reminders
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/notifications" className="nav-link text-white">
                <i className="bi bi-bell me-2"></i> Notifications
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/profile" className="nav-link text-white">
                <i className="bi bi-person-circle me-2"></i> Profile
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/invitations" className="nav-link text-white">
                <i className="bi bi-envelope-paper me-2"></i> Invitations
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reviews" className="nav-link text-white">
                <i className="bi bi-star me-2"></i> Reviews
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/reports" className="nav-link text-white">
                <i className="bi bi-flag me-2"></i> Reports
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

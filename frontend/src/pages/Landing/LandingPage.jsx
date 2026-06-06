import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-4 fw-bold">Notes App</h1>

        <p className="lead">
          Manage Notes, Groups, Reminders and Notifications.
        </p>

        <div className="mt-4">
          <Link to="/login" className="btn btn-primary me-2">
            Login
          </Link>

          <Link to="/register" className="btn btn-success">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

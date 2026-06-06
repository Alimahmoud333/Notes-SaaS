import { Link } from "react-router-dom";

export default function PaymentSuccessPage() {
  return (
    <div className="container py-5 text-center">
      <div className="alert alert-success">
        Payment Completed Successfully 🎉
      </div>

      <h3>Your account will be upgraded automatically.</h3>

      <Link to="/dashboard" className="btn btn-primary mt-4">
        Go Dashboard
      </Link>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <div className="container py-5 text-center">
      <div className="alert alert-danger">Payment Cancelled</div>

      <Link to="/pricing" className="btn btn-warning">
        Try Again
      </Link>
    </div>
  );
}

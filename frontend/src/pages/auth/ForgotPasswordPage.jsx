import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { useToast } from "../../context/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { forgotPassword } = useAuth();

  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await forgotPassword({
        email,
      });

      showToast(res.message, "success");
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-header">Forgot Password</div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button className="btn btn-warning w-100">Send OTP</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

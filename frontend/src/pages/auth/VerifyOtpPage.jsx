import { useState } from "react";

import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { useToast } from "../../context/ToastContext";

import { useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const user_id = params.get("user_id");

  const { verifyOtp } = useAuth();

  const { showToast } = useToast();

  const [code, setCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await verifyOtp({
        user_id,
        code,
      });

      showToast(res.message, "success");

      navigate("/login");
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-header">Verify OTP</div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-3"
                  placeholder="OTP Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <button className="btn btn-primary w-100">Verify</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

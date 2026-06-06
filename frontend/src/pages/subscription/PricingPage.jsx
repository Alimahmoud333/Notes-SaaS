import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function PricingPage() {
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);

  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const res = await API.get("/plans");

      setPlans(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function upgrade() {
    try {
      setPaying(true);

      const res = await API.post("/subscribe");

      window.location.href = res.data.url;
    } catch (error) {
      showToast(error.response?.data?.message || "Payment failed", "danger");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Choose Your Plan</h2>

      <div className="row">
        {plans.map((plan, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center">
                <h3>{plan.name}</h3>

                <h1 className="my-3">${plan.price}</h1>

                <hr />

                <p>Notes: {plan.notes_limit}</p>

                <p>Images: {plan.images ? "✅" : "❌"}</p>

                <p>Files: {plan.files ? "✅" : "❌"}</p>

                {plan.name === "Pro" ? (
                  <button
                    className="btn btn-success"
                    disabled={paying}
                    onClick={upgrade}>
                    {paying ? "Redirecting..." : "Upgrade Now"}
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Current Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

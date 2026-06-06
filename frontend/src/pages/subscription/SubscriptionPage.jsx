import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function SubscriptionPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    const res = await API.get("/subscription");

    setData(res.data);
  }

  if (!data) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          <h3>Current Plan</h3>

          <h1 className="text-primary">{data.plan}</h1>

          <p>Expire Date: {data.expires_at || "No Expiration"}</p>

          <p>Payment Status: {data.subscription?.payment_status}</p>
        </div>
      </div>
    </div>
  );
}

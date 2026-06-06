import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function AdminReviewsPage() {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    try {
      const res = await API.get("/admin/reviews");

      setReviews(res.data.data);
    } catch (error) {
      showToast("Failed to load reviews", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reviews</h2>

      {loading && <div className="spinner-border" />}

      {!loading &&
        reviews.map((review) => (
          <div key={review.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{"⭐".repeat(review.rating)}</h5>

              <p>{review.comment}</p>

              <small className="text-muted">{review.user?.name}</small>
            </div>
          </div>
        ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../../api/axios";

import ReviewCard from "../../components/reviews/ReviewCard";
import CreateReviewModal from "../../components/reviews/CreateReviewModal";
import UpdateReviewModal from "../../components/reviews/UpdateReviewModal";

import { useToast } from "../../context/ToastContext";

export default function ReviewsPage() {
  const { showToast } = useToast();

  const [review, setReview] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);

  async function loadReview() {
    try {
      setLoading(true);

      const res = await API.get("/my-review");

      setReview(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReview();
  }, []);

  async function deleteReview(id) {
    try {
      const confirmDelete = window.confirm("Delete your review?");

      if (!confirmDelete) return;

      await API.delete(`/reviews/${id}`);

      setReview(null);

      showToast("Review deleted successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Delete failed", "danger");
    }
  }

  return (
    <>
      <div className="container py-4">
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">My Review</h2>

              <small className="text-muted">
                Pro users can submit one review
              </small>
            </div>

            {!review && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}>
                + Add Review
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border"></div>
          </div>
        )}

        {!loading && !review && (
          <div className="alert alert-info">
            You have not submitted any review yet.
          </div>
        )}

        {!loading && review && (
          <ReviewCard
            review={review}
            onEdit={() => setShowUpdate(true)}
            onDelete={() => deleteReview(review.id)}
          />
        )}
      </div>

      {showCreate && (
        <CreateReviewModal
          reload={loadReview}
          onClose={() => {
            setShowCreate(false);
          }}
        />
      )}

      {showUpdate && review && (
        <UpdateReviewModal
          review={review}
          reload={loadReview}
          onClose={() => {
            setShowUpdate(false);
          }}
        />
      )}
    </>
  );
}

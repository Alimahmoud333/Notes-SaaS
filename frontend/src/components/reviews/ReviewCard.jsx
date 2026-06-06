export default function ReviewCard({ review, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="mb-3">{"⭐".repeat(review.rating)}</h4>

        <p className="text-muted">{review.comment || "No comment"}</p>

        <div className="d-flex gap-2">
          <button className="btn btn-warning btn-sm" onClick={onEdit}>
            Edit
          </button>

          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

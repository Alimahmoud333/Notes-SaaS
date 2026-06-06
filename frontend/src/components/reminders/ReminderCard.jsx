export default function ReminderCard({ reminder, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{reminder.note?.title || "Note"}</h5>

            <div className="text-muted">Reminder At:</div>

            <div>{new Date(reminder.remind_at).toLocaleString()}</div>

            <div className="mt-2">
              <span
                className={`badge ${
                  reminder.is_sent ? "bg-success" : "bg-warning"
                }`}>
                {reminder.is_sent ? "Sent" : "Pending"}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(reminder)}>
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(reminder)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

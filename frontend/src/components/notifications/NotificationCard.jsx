import moment from "moment";

export default function NotificationCard({ notification, onRead, onDelete }) {
  return (
    <div
      className={`card shadow-sm mb-3 ${
        !notification.is_read ? "border-primary" : ""
      }`}>
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="mb-1">
              {notification.title}

              {!notification.is_read && (
                <span className="badge bg-primary ms-2">New</span>
              )}
            </h5>

            <p className="text-muted mb-2">{notification.message}</p>

            <small className="text-secondary">
              {moment(notification.created_at).fromNow()}
            </small>
          </div>

          <div className="d-flex flex-column gap-2">
            {!notification.is_read && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => onRead(notification.id)}>
                Mark Read
              </button>
            )}

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(notification.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

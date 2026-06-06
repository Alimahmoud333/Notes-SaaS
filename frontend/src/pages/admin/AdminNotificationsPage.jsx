import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function AdminNotificationsPage() {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      const res = await API.get("/admin/notifications");

      setNotifications(res.data.data);
    } catch (error) {
      showToast("Failed to load notifications", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Notifications</h2>

      {loading && <div className="spinner-border" />}

      {!loading &&
        notifications.map((notification) => (
          <div key={notification.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{notification.title}</h5>

              <p>{notification.message}</p>

              <p>
                <strong>User:</strong> {notification.user?.name}
              </p>

              <span
                className={`badge ${
                  notification.is_read ? "bg-success" : "bg-danger"
                }`}>
                {notification.is_read ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

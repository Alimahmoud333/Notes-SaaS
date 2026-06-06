import { useEffect, useState } from "react";
import API from "../../api/axios";
import NotificationCard from "../../components/notifications/NotificationCard";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

export default function NotificationsPage() {
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications(page = 1) {
    try {
      setLoading(true);
      const res = await API.get(`/notifications?page=${page}`);
      setNotifications(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      const res = await API.post(`/notifications/${id}/read`);
      showToast(res.data.message, "success");
      loadNotifications(pagination.current_page);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "danger",
      );
    }
  }

  async function markAllRead() {
    try {
      const res = await API.post("/notifications/read-all");
      showToast(res.data.message, "success");
      loadNotifications(pagination.current_page);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "danger",
      );
    }
  }

  function deleteNotification(id) {
    showModal({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      onConfirm: async () => {
        try {
          const res = await API.delete(`/notifications/${id}`);
          showToast(res.data.message, "success");
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
          showToast(
            error.response?.data?.message || "Something went wrong",
            "danger",
          );
        }
      },
    });
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Notifications</h2>
          <small className="text-muted">
            {unreadCount} unread notifications
          </small>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-primary" onClick={markAllRead}>
            Mark All Read
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="alert alert-info">No notifications found</div>
      )}

      {!loading &&
        notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRead={markRead}
            onDelete={deleteNotification}
          />
        ))}

      {!loading && pagination.last_page > 1 && (
        <div className="mt-4 d-flex justify-content-center gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => (
            <button
              key={i}
              className={`btn ${
                pagination.current_page === i + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => loadNotifications(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

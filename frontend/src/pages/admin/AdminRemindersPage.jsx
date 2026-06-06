import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function AdminRemindersPage() {
  const { showToast } = useToast();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReminders() {
    try {
      const res = await API.get("/admin/reminders");

      setReminders(res.data.data);
    } catch (error) {
      showToast("Failed to load reminders", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reminders</h2>

      {loading && <div className="spinner-border" />}

      {!loading &&
        reminders.map((reminder) => (
          <div key={reminder.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{reminder.note?.title}</h5>

              <p>
                <strong>User:</strong> {reminder.user?.name}
              </p>

              <p>
                <strong>Reminder Date:</strong> {reminder.remind_at}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

import { useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function UpdateReminderModal({ reminder, onClose, reload }) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [remindAt, setRemindAt] = useState(reminder.remind_at.slice(0, 16));

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(`/reminders/${reminder.id}`, {
        remind_at: remindAt,
      });

      showToast(res.data.message, "success");

      reload();

      onClose();
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Update Reminder</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <label>Reminder Date</label>

                <input
                  type="datetime-local"
                  className="form-control"
                  value={remindAt}
                  onChange={(e) => setRemindAt(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}>
                  Cancel
                </button>

                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

import { useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function CreateReminderModal({ notes, onClose, reload }) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    note_id: "",
    remind_at: "",
  });

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/reminders", form);

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
              <h5>Create Reminder</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <label>Select Note</label>

                <select
                  className="form-select mb-3"
                  required
                  value={form.note_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note_id: e.target.value,
                    })
                  }>
                  <option value="">Select Note</option>

                  {notes.map((note) => (
                    <option key={note.id} value={note.id}>
                      {note.title}
                    </option>
                  ))}
                </select>

                <label>Reminder Date</label>

                <input
                  type="datetime-local"
                  className="form-control"
                  required
                  value={form.remind_at}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      remind_at: e.target.value,
                    })
                  }
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
                  {loading ? "Creating..." : "Create"}
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

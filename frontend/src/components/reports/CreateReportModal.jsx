import { useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function CreateReportModal({ note, onClose }) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/reports", {
        note_id: note.id,
        reason,
      });

      showToast(res.data.message, "success");

      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,.5)",
      }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Report Note</h5>

            <button className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">
              <p>
                Reporting:
                <strong> {note.title}</strong>
              </p>

              <textarea
                className="form-control"
                rows="5"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you reporting this note?"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}>
                Cancel
              </button>

              <button className="btn btn-danger" disabled={loading}>
                {loading ? "Submitting..." : "Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

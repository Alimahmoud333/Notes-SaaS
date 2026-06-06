import { useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function InviteMemberModal({ groupId, onClose }) {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(`/groups/${groupId}/invite`, {
        email,
      });

      showToast(res.data.message, "success");

      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || "Error", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{
          background: "rgba(0,0,0,.5)",
        }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Invite Member</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <label>User Email</label>

                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}>
                  Cancel
                </button>

                <button disabled={loading} className="btn btn-primary">
                  {loading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function PermissionsModal({ groupId, member, onClose, reload }) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    can_view: member.can_view,
    can_edit: member.can_edit,
    can_delete: member.can_delete,
  });

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        `/groups/${groupId}/permissions/${member.user_id}`,
        form,
      );

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
      <div
        className="modal fade show d-block"
        style={{ background: "rgba(0,0,0,.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Update Permissions</h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.can_view}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        can_view: e.target.checked,
                      })
                    }
                  />

                  <label className="form-check-label">Can View</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.can_edit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        can_edit: e.target.checked,
                      })
                    }
                  />

                  <label className="form-check-label">Can Edit</label>
                </div>

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.can_delete}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        can_delete: e.target.checked,
                      })
                    }
                  />

                  <label className="form-check-label">Can Delete</label>
                </div>
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
    </>
  );
}

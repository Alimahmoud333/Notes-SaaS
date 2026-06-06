import { useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function UpdateSharedNoteModal({ note, onClose, reload }) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
  });

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(`/shared-notes/${note.id}`, form);

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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Update Shared Note</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <textarea
                  rows="8"
                  className="form-control"
                  value={form.content}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      content: e.target.value,
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

                <button disabled={loading} className="btn btn-primary">
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

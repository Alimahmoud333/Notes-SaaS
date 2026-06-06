import { useState } from "react";

import API from "../../api/axios";

import { useNotesDispatch } from "../../context/NotesContext";
import { useToast } from "../../context/ToastContext";
export default function UpdateNoteModal({ note, onClose }) {
  const dispatch = useNotesDispatch();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: note?.title || "",
    content: note?.content || "",
    image: null,
    file: null,
  });

    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();

  async function updateNote() {
    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("content", form.content);

      if (form.image) {
        fd.append("image", form.image);
      }

      if (form.file) {
        fd.append("file", form.file);
      }

      const res = await API.post(`/notes/${note.id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        type: "updated",
        payload: res.data.note,
      });

        onClose();
        showToast("Note updated successfully", "success");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">Update Note</h5>

              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>

                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Content</label>

                <textarea
                  rows="6"
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

              {/* CURRENT IMAGE */}
              {note?.image && (
                <div className="mb-3">
                  <label className="form-label">Current Image</label>

                  <img
                    src={`http://127.0.0.1:8000/storage/${note.image}`}
                    alt=""
                    className="img-fluid rounded border"
                  />
                </div>
              )}

              {/* PRO FEATURES */}
              {user?.plan === "pro" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Replace Image</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image: e.target.files[0],
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Replace File</label>

                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setForm({
                          ...form,
                          file: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </>
              )}

              {user?.plan !== "pro" && (
                <div className="alert alert-warning">
                  Image & File upload available only for Pro users.
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={updateNote}>
                {loading ? "Updating..." : "Update Note"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
}

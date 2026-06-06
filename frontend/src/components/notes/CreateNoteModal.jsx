import { useState } from "react";

import API from "../../api/axios";

import { useNotesDispatch } from "../../context/NotesContext";
import { useToast } from "../../context/ToastContext";
export default function CreateNoteModal({ onClose }) {
  const dispatch = useNotesDispatch();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
    file: null,
  });

  const { showToast } = useToast();

  const user = JSON.parse(localStorage.getItem("user"));

  async function createNote() {
    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("content", form.content);

      if (form.image) fd.append("image", form.image);

      if (form.file) fd.append("file", form.file);

      const res = await API.post("/notes", fd);

      dispatch({
        type: "added",
        payload: res.data.note,
      });

      onClose();

      showToast("Note created successfully", "success");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create Note</h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <input
                className="form-control mb-3"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="Content"
                value={form.content}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: e.target.value,
                  })
                }
              />

              {user?.plan === "pro" && (
                <>
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.files[0],
                      })
                    }
                  />

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
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>

              <button className="btn btn-primary" onClick={createNote}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

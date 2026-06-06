import { useState } from "react";

import API from "../../api/axios";

import { useGroupsDispatch } from "../../context/GroupsContext";

import { useToast } from "../../context/ToastContext";

export default function CreateGroupModal({ onClose }) {
  const dispatch = useGroupsDispatch();

  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_private: false,
    image: null,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("is_private", form.is_private ? 1 : 0);

      if (form.image) {
        data.append("image", form.image);
      }

      const res = await API.post("/groups", data);

      dispatch({
        type: "added",
        payload: res.data.group,
      });

      showToast("Group created successfully", "success");

      onClose();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Error creating group",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Create Group</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Group Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files[0],
                    })
                  }
                />

                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.is_private}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_private: e.target.checked,
                      })
                    }
                  />

                  <label className="form-check-label">Private Group</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}>
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

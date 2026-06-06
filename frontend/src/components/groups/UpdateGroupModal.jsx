import { useState } from "react";

import API from "../../api/axios";

import { useGroupsDispatch } from "../../context/GroupsContext";

import { useToast } from "../../context/ToastContext";

export default function UpdateGroupModal({ group, onClose }) {
  const dispatch = useGroupsDispatch();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: group.name,
    description: group.description,
    is_private: group.is_private,
    image: null,
  });

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

      const res = await API.post(`/groups/${group.id}`, data);

      dispatch({
        type: "updated",
        payload: res.data.group,
      });

      showToast("Group updated successfully", "success");

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
              <h5>Update Group</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <textarea
                  rows="4"
                  className="form-control mb-3"
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
                  className="btn btn-secondary"
                  onClick={onClose}
                  type="button">
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

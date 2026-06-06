import { useEffect, useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function ShareNoteModal({ note, onClose }) {
  const { showToast } = useToast();

  const [groups, setGroups] = useState([]);

  const [groupId, setGroupId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      const res = await API.get("/my-groups");

      setGroups(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(`/notes/${note.id}/share`, {
        group_id: groupId,
      });

      showToast(res.data.message, "success");

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
              <h5>Share Note</h5>

              <button className="btn-close" onClick={onClose} />
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <select
                  className="form-select"
                  required
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}>
                  <option value="">Select Group</option>

                  {groups.map((member) => (
                    <option key={member.group.id} value={member.group.id}>
                      {member.group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}>
                  Cancel
                </button>

                <button disabled={loading} className="btn btn-primary">
                  {loading ? "Sharing..." : "Share"}
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

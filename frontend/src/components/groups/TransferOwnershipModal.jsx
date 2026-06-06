import { useState } from "react";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function TransferOwnershipModal({
  groupId,
  member,
  onClose,
  reload,
}) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  async function transfer() {
    try {
      setLoading(true);

      const res = await API.post(
        `/groups/${groupId}/transfer/${member.user_id}`,
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
              <h5>Transfer Ownership</h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to transfer ownership to:</p>

              <strong>{member.user?.name}</strong>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button
                className="btn btn-danger"
                disabled={loading}
                onClick={transfer}>
                {loading ? "Transferring..." : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

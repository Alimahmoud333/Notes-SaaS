import { useEffect, useState } from "react";

import API from "../../api/axios";

import { useToast } from "../../context/ToastContext";

export default function InvitationsPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [invitations, setInvitations] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    loadInvitations();
  }, []);

  async function loadInvitations(page = 1) {
    try {
      setLoading(true);

      const res = await API.get(`/my-invitations?page=${page}`);

      setInvitations(res.data.data);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function accept(id) {
    try {
      const res = await API.post(`/invitations/${id}/accept`);

      showToast(res.data.message, "success");

      loadInvitations(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  async function reject(id) {
    try {
      const res = await API.post(`/invitations/${id}/reject`);

      showToast(res.data.message, "warning");

      loadInvitations(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Invitations</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" />
        </div>
      )}

      {!loading && invitations.length === 0 && (
        <div className="alert alert-info">No Invitations Found</div>
      )}

      {!loading &&
        invitations.map((invitation) => (
          <div key={invitation.id} className="card shadow-sm mb-3">
            <div className="card-body">
              <h5>{invitation.group?.name}</h5>

              <div>Invited By: {invitation.inviter?.name}</div>

              <div>
                Status:{" "}
                <span
                  className={`badge ${
                    invitation.status === "accepted"
                      ? "bg-success"
                      : invitation.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning"
                  }`}>
                  {invitation.status}
                </span>
              </div>

              {invitation.status === "pending" && (
                <div className="mt-3 d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => accept(invitation.id)}>
                    Accept
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => reject(invitation.id)}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      <div className="mt-4 d-flex justify-content-center gap-2">
        {Array.from(
          {
            length: pagination.last_page,
          },
          (_, i) => (
            <button
              key={i}
              className={`btn ${
                pagination.current_page === i + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => loadInvitations(i + 1)}>
              {i + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

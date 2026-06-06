import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import InviteMemberModal from "../../components/groups/InviteMemberModal";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    loadGroup();
  }, []);

  async function loadGroup() {
    try {
      const res = await API.get(`/groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Group not found</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Group Card */}
      <div className="card shadow-lg border-0">
        {group.image && (
          <img
            src={`http://127.0.0.1:8000/storage/${group.image}`}
            className="card-img-top"
            alt="Group"
            style={{ height: "250px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="fw-bold text-primary">{group.name}</h2>
            <div className="d-flex gap-2">
              <Link
                to={`/groups/${group.id}/notes`}
                className="btn btn-outline-success">
                <i className="bi bi-journal-text me-2"></i> Notes
              </Link>
              <Link
                to={`/groups/${group.id}/members`}
                className="btn btn-outline-info">
                <i className="bi bi-people me-2"></i> Members
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => setShowInvite(true)}>
                <i className="bi bi-person-plus me-2"></i> Invite
              </button>
            </div>
          </div>

          <p className="mt-3">{group.description}</p>
          <hr />

          <p>
            <strong>Owner:</strong> {group.owner?.name}
          </p>
          <p>
            <strong>Members:</strong> {group.members_count}
          </p>
          <span
            className={`badge ${group.is_private ? "bg-danger" : "bg-success"}`}>
            {group.is_private ? "Private" : "Public"}
          </span>
        </div>
      </div>

      {/* Members List */}
      <div className="card shadow mt-4">
        <div className="card-header fw-bold">
          <i className="bi bi-people me-2"></i> Group Members
        </div>
        <div className="card-body">
          {group.members?.length === 0 ? (
            <div className="alert alert-info text-center">No members found</div>
          ) : (
            group.members?.map((member) => (
              <div
                key={member.id}
                className="d-flex align-items-center border-bottom py-3">
                <img
                  src={
                    member.avatar
                      ? `http://127.0.0.1:8000/storage/${member.avatar}`
                      : `https://ui-avatars.com/api/?name=${member.name}`
                  }
                  alt="Member"
                  width="50"
                  height="50"
                  className="rounded-circle me-3 shadow-sm"
                />
                <div>
                  <div className="fw-bold">{member.name}</div>
                  <small className="text-muted">{member.email}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteMemberModal
          groupId={group.id}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

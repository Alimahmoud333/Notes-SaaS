import { Link } from "react-router-dom";

export default function MemberCard({
  member,
  isOwner,
  onRemove,
  onPermissions,
  onTransfer,
}) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img
            src={
              member.user?.avatar
                ? `http://127.0.0.1:8000/storage/${member.user.avatar}`
                : `https://ui-avatars.com/api/?name=${member.user?.name}`
            }
            alt=""
            width="50"
            height="50"
            className="rounded-circle me-3"
          />

          <div>
            <div className="fw-bold">{member.user?.name}</div>

            <small className="text-muted">{member.user?.email}</small>
          </div>
        </div>

        {isOwner && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onPermissions(member)}>
              Permissions
            </button>

            <button
              className="btn btn-info btn-sm"
              onClick={() => onTransfer(member)}>
              Transfer
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemove(member)}>
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

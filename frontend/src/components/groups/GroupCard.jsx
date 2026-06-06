import { Link } from "react-router-dom";

export default function GroupCard({ group, onDelete, onEdit }) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5>{group.name}</h5>

            <p className="text-muted">{group.description}</p>

            <span className="badge bg-primary">
              {group.members_count} Members
            </span>
          </div>

          <div>
            <Link
              to={`/groups/${group.id}`}
              className="btn btn-info btn-sm me-2">
              View
            </Link>

            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => onEdit(group)}>
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(group)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

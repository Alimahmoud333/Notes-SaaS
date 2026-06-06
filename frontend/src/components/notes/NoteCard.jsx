import { Link } from "react-router-dom";

export default function NoteCard({ note, onEdit, onDelete, onShare }) {
  return (
    <div className="card shadow-sm mb-3 h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="fw-bold text-primary">{note.title}</h5>
          <p className="text-muted">{note.content?.substring(0, 100)}...</p>
          <div className="d-flex gap-2 flex-wrap">
            {note.is_shared && <span className="badge bg-success">Shared</span>}
            {note.is_pinned && <span className="badge bg-warning">Pinned</span>}
            {note.is_archived && (
              <span className="badge bg-secondary">Archived</span>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Link
            to={`/notes/${note.id}`}
            className="btn btn-outline-primary btn-sm">
            <i className="bi bi-eye"></i> View
          </Link>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onShare(note)}>
            <i className="bi bi-share"></i> Share
          </button>
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => onEdit(note)}>
            <i className="bi bi-pencil"></i> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(note)}>
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

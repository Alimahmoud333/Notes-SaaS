import React from "react";
import { Link } from "react-router-dom";
export default function SharedNoteCard({
  note,
  onEdit,
  onDelete,
  onPin,
  onArchive,
  onReport,
}) {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5>{note.title}</h5>

            <p className="text-muted">{note.content}</p>

            <div className="mb-2">
              <span className="badge bg-primary me-2">{note.group?.name}</span>

              <span className="badge bg-secondary">{note.user?.name}</span>
            </div>

            {note.is_pinned && (
              <span className="badge bg-warning me-2">Pinned</span>
            )}

            {note.is_archived && (
              <span className="badge bg-dark">Archived</span>
            )}
          </div>

          <div className="d-flex flex-column gap-2">
            <Link
  to={`/shared-notes/${note.id}`}
  className="btn btn-primary btn-sm"
>
  View
            </Link>
            
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(note)}>
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(note)}>
              Delete
            </button>

            <button className="btn btn-info btn-sm" onClick={() => onPin(note)}>
              {note.is_pinned ? "Unpin" : "Pin"}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onArchive(note)}>
              {note.is_archived ? "Unarchive" : "Archive"}
            </button>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onReport?.(note)}>
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

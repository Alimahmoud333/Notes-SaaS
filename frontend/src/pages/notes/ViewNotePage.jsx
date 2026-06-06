import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";

export default function ViewNotePage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNote();
  }, []);

  async function loadNote() {
    try {
      const res = await API.get(`/notes/${id}`);
      setNote(res.data);
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

  if (!note) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Note not found</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/notes" className="btn btn-secondary mb-3">
        ← Back to Notes
      </Link>

      <div className="card shadow-lg border-0">
        <div className="card-body">
          {/* Title */}
          <h2 className="fw-bold text-primary">{note.title}</h2>
          <hr />

          {/* Content */}
          <p
            className="fs-5"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
            }}>
            {note.content}
          </p>

          {/* Owner */}
          {note.user && (
            <>
              <hr />
              <p>
                <strong>Owner:</strong>{" "}
                <span className="text-muted">{note.user.name}</span>
              </p>
            </>
          )}

          {/* Group */}
          {note.group && (
            <p>
              <strong>Group:</strong>{" "}
              <span className="text-muted">{note.group.name}</span>
            </p>
          )}

          {/* Image */}
          {note.image && (
            <>
              <hr />
              <h5 className="fw-bold">Attached Image</h5>
              <img
                src={`http://127.0.0.1:8000/storage/${note.image}`}
                alt="Note"
                className="img-fluid rounded shadow-sm mt-2"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </>
          )}

          {/* File */}
          {note.file && (
            <>
              <hr />
              <h5 className="fw-bold">Attached File</h5>
              <a
                href={`http://127.0.0.1:8000/storage/${note.file}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success mt-2">
                <i className="bi bi-file-earmark-arrow-down me-2"></i>
                Open File
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

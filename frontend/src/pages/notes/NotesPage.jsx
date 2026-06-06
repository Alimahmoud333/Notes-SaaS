import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNotes, useNotesDispatch } from "../../context/NotesContext";
import NoteCard from "../../components/notes/NoteCard";
import CreateNoteModal from "../../components/notes/CreateNoteModal";
import UpdateNoteModal from "../../components/notes/UpdateNoteModal";
import ShareNoteModal from "../../components/shared-notes/ShareNoteModal";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext"; 

export default function NotesPage() {
  const notes = useNotes();
  const dispatch = useNotesDispatch();
  const { showToast } = useToast();
  const { showModal } = useModal(); 

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedShareNote, setSelectedShareNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    dispatch({ type: "get" });
    loadNotes();
  }, []);

  async function loadNotes(page = 1) {
    try {
      setLoading(true);
      const res = await API.get(`/notes?page=${page}`);
      dispatch({ type: "set", payload: res.data.data });
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      showToast("Failed to load notes", "danger");
    } finally {
      setLoading(false);
    }
  }

  function deleteNote(note) {
    showModal({
      title: "Delete Note",
      message: `Are you sure you want to delete "${note.title}"?`,
      onConfirm: async () => {
        try {
          await API.delete(`/notes/${note.id}`);
          dispatch({ type: "deleted", payload: note.id });
          showToast("Note deleted successfully", "success");
        } catch (error) {
          showToast(error.response?.data?.message || "Delete failed", "danger");
        }
      },
    });
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📝 My Notes</h2>
        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
          <i className="bi bi-plus-circle me-2"></i> Create Note
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex align-items-center">
          <i className="bi bi-search text-muted me-2"></i>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {!loading && filteredNotes.length === 0 && (
        <div className="alert alert-info text-center">No Notes Found</div>
      )}

      <div className="row">
        {!loading &&
          filteredNotes.map((note) => (
            <div className="col-md-6 col-lg-4" key={note.id}>
              <NoteCard
                note={note}
                onDelete={deleteNote}
                onEdit={(n) => {
                  setSelectedNote(n);
                  setShowUpdate(true);
                }}
                onShare={(n) => {
                  setSelectedShareNote(n);
                  setShowShare(true);
                }}
              />
            </div>
          ))}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: pagination.last_page }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  pagination.current_page === index + 1 ? "active" : ""
                }`}>
                <button
                  className="page-link"
                  onClick={() => loadNotes(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {showCreate && <CreateNoteModal onClose={() => setShowCreate(false)} />}
      {showUpdate && selectedNote && (
        <UpdateNoteModal
          note={selectedNote}
          onClose={() => {
            setShowUpdate(false);
            setSelectedNote(null);
          }}
        />
      )}
      {showShare && selectedShareNote && (
        <ShareNoteModal
          note={selectedShareNote}
          onClose={() => {
            setShowShare(false);
            setSelectedShareNote(null);
          }}
        />
      )}
    </div>
  );
}

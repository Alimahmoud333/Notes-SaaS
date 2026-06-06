import { useEffect, useState } from "react";

import API from "../../api/axios";

import SharedNoteCard from "../../components/shared-notes/SharedNoteCard";

import UpdateSharedNoteModal from "../../components/shared-notes/UpdateSharedNoteModal";


import { useToast } from "../../context/ToastContext";

export default function SharedNotesPage() {
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedNote, setSelectedNote] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });



  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes(page = 1) {
    try {
      setLoading(true);

      const res = await API.get(`/shared-notes?page=${page}`);

      setNotes(res.data.data);

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

  async function deleteNote(note) {
    if (!window.confirm(`Delete "${note.title}" ?`)) return;

    try {
      const res = await API.delete(`/shared-notes/${note.id}`);

      showToast(res.data.message, "success");

      loadNotes(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  async function pinNote(note) {
    try {
      const res = await API.post(`/notes/${note.id}/pin`);

      showToast(res.data.message, "success");

      loadNotes(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  async function archiveNote(note) {
    try {
      const res = await API.post(`/notes/${note.id}/archive`);

      showToast(res.data.message, "success");

      loadNotes(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-4">Shared Notes</h2>

        {loading && (
          <div className="text-center">
            <div className="spinner-border" />
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="alert alert-info">No shared notes found</div>
        )}

        {!loading &&
          notes.map((note) => (
            <SharedNoteCard
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onPin={pinNote}
              onArchive={archiveNote}
              onEdit={(note) => {
                setSelectedNote(note);
                setShowUpdate(true);
              }}
              onReport={(note) => {
                setSelectedReportNote(note);
                setShowReport(true);
              }}
            />
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
                onClick={() => loadNotes(i + 1)}>
                {i + 1}
              </button>
            ),
          )}
        </div>
      </div>

      {showUpdate && selectedNote && (
        <UpdateSharedNoteModal
          note={selectedNote}
          reload={loadNotes}
          onClose={() => {
            setShowUpdate(false);
            setSelectedNote(null);
          }}
        />
      )}


    </>
  );
}

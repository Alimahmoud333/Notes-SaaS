import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../api/axios";

import SharedNoteCard from "../../components/shared-notes/SharedNoteCard";

import UpdateSharedNoteModal from "../../components/shared-notes/UpdateSharedNoteModal";

import { useToast } from "../../context/ToastContext";

import CreateReportModal from "../../components/reports/CreateReportModal";

export default function GroupNotesPage() {
  const { id } = useParams();

  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedNote, setSelectedNote] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);

  const [group, setGroup] = useState(null);

  const [showReport, setShowReport] = useState(false);

  const [selectedReportNote, setSelectedReportNote] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(page = 1) {
    try {
      setLoading(true);

      const groupRes = await API.get(`/groups/${id}`);

      const notesRes = await API.get(`/groups/${id}/notes?page=${page}`);

      setGroup(groupRes.data);

      setNotes(notesRes.data.data);

      setPagination({
        current_page: notesRes.data.current_page,
        last_page: notesRes.data.last_page,
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

      loadData(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  async function pinNote(note) {
    try {
      const res = await API.post(`/notes/${note.id}/pin`);

      showToast(res.data.message, "success");

      loadData(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  async function archiveNote(note) {
    try {
      const res = await API.post(`/notes/${note.id}/archive`);

      showToast(res.data.message, "success");

      loadData(pagination.current_page);
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <>
      <div className="container py-4">
        <div className="mb-4">
          <h2>Group Notes</h2>

          {group && <p className="text-muted">{group.name}</p>}
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border" />
          </div>
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
                onClick={() => loadData(i + 1)}>
                {i + 1}
              </button>
            ),
          )}
        </div>
      </div>

      {showUpdate && selectedNote && (
        <UpdateSharedNoteModal
          note={selectedNote}
          reload={loadData}
          onClose={() => {
            setShowUpdate(false);
            setSelectedNote(null);
          }}
        />
      )}

      {showReport && selectedReportNote && (
              <CreateReportModal
                note={selectedReportNote}
                onClose={() => {
                  setShowReport(false);
                  setSelectedReportNote(null);
                }}
              />
            )}
    </>
  );
}

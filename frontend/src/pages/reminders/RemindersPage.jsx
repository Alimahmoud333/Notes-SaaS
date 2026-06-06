import { useEffect, useState } from "react";

import API from "../../api/axios";

import ReminderCard from "../../components/reminders/ReminderCard";

import CreateReminderModal from "../../components/reminders/CreateReminderModal";

import UpdateReminderModal from "../../components/reminders/UpdateReminderModal";

import { useToast } from "../../context/ToastContext";

export default function RemindersPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [reminders, setReminders] = useState([]);

  const [notes, setNotes] = useState([]);

  const [showCreate, setShowCreate] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);

  const [selectedReminder, setSelectedReminder] = useState(null);

  useEffect(() => {
    loadReminders();
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await API.get("/notes");

      setNotes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadReminders() {
    try {
      setLoading(true);

      const res = await API.get("/reminders");

      setReminders(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReminder(reminder) {
    if (!window.confirm("Delete reminder?")) return;

    try {
      const res = await API.delete(`/reminders/${reminder.id}`);

      showToast(res.data.message, "success");

      loadReminders();
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between mb-4">
          <h2>Reminders</h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}>
            Create Reminder
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" />
          </div>
        ) : reminders.length === 0 ? (
          <div className="alert alert-info">No reminders found</div>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={(r) => {
                setSelectedReminder(r);
                setShowUpdate(true);
              }}
              onDelete={deleteReminder}
            />
          ))
        )}
      </div>

      {showCreate && (
        <CreateReminderModal
          notes={notes}
          reload={loadReminders}
          onClose={() => setShowCreate(false)}
        />
      )}

      {showUpdate && selectedReminder && (
        <UpdateReminderModal
          reminder={selectedReminder}
          reload={loadReminders}
          onClose={() => {
            setShowUpdate(false);
            setSelectedReminder(null);
          }}
        />
      )}
    </>
  );
}

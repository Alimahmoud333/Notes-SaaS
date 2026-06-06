export default function notesReducer(currentNotes, action) {
  switch (action.type) {
    case "set": {
      localStorage.setItem("notes", JSON.stringify(action.payload));

      return action.payload;
    }

    case "get": {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];

      return notes;
    }

    case "added": {
      const updated = [action.payload, ...currentNotes];

      localStorage.setItem("notes", JSON.stringify(updated));

      return updated;
    }

    case "updated": {
      const updated = currentNotes.map((note) =>
        note.id === action.payload.id ? action.payload : note,
      );

      localStorage.setItem("notes", JSON.stringify(updated));

      return updated;
    }

    case "deleted": {
      const updated = currentNotes.filter((note) => note.id !== action.payload);

      localStorage.setItem("notes", JSON.stringify(updated));

      return updated;
    }

    default:
      throw Error("Unknown Action");
  }
}

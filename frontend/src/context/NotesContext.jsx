import { createContext, useContext, useReducer } from "react";

import notesReducer from "../reducers/notesReducer";

export const NotesContext = createContext([]);

export const NotesDispatchContext = createContext(null);

export default function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(notesReducer, []);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);

export const useNotesDispatch = () => useContext(NotesDispatchContext);

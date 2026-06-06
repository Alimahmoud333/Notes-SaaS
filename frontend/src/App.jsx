import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";

import { ToastProvider } from "./context/ToastContext";

import ProfileProvider from "./context/ProfileContext";

import NotesProvider from "./context/NotesContext";
import GroupsProvider from "./context/GroupsContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ModalProvider } from "./context/ModalContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ProfileProvider>
            <NotesProvider>
              <GroupsProvider>
                <NotificationProvider>
                  <ModalProvider>
                    <AppRoutes />
                  </ModalProvider>
                </NotificationProvider>
              </GroupsProvider>
            </NotesProvider>
          </ProfileProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

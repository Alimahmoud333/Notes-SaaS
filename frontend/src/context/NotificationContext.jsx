import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadNotifications(page = 1) {
    const res = await API.get(`/notifications?page=${page}`);
    setNotifications(res.data.data);
    setUnreadCount(res.data.data.filter((n) => !n.is_read).length);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);

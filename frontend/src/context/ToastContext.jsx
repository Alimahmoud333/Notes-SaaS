import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  function showToast(message, type = "success") {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast.show && (
        <div
          className="toast show position-fixed bottom-0 end-0 m-4"
          style={{
            zIndex: 9999,
          }}>
          <div className={`toast-header text-white bg-${toast.type}`}>
            <strong className="me-auto">Notes App</strong>
          </div>

          <div className="toast-body">{toast.message}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

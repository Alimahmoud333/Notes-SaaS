import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  function showModal({ title, message, onConfirm }) {
    setModal({
      show: true,
      title,
      message,
      onConfirm,
    });
  }

  function hideModal() {
    setModal({ show: false, title: "", message: "", onConfirm: null });
  }

  function confirm() {
    if (modal.onConfirm) modal.onConfirm();
    hideModal();
  }

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}

      {modal.show && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">{modal.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={hideModal}></button>
              </div>
              <div className="modal-body">
                <p>{modal.message}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={hideModal}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

import { useEffect } from "react";
import "./LogoutConfirmModal.css";

function LogoutConfirmModal({ onConfirm, onCancel }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div className="logout-overlay" onClick={onCancel}>
      <div
        className="logout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-icon">🚪</div>

        <h2>Are you sure?</h2>

        <p>
          Are you sure you want to log out of your account?
        </p>

        <div className="logout-actions">
          <button
            type="button"
            className="logout-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="logout-confirm"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;

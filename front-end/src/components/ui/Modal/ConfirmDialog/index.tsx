import { useState } from "react";

import Modal from "../../Modal";

interface ConfirmDialogProps {
  title: string;
  itemName: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

const ConfirmDialog = ({
  title,
  itemName,
  confirmLabel,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      const success = await onConfirm();

      if (success) {
        onClose();
      } else {
        setError("Unable to delete. Please try again.");
      }
    } catch {
      setError("Unable to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} busy={isDeleting}>
      <p className="confirm-copy">
        Are you sure you want to delete <strong>{itemName}</strong>? This action
        cannot be undone.
      </p>

      {error && (
        <p className="confirm-error" role="alert">
          {error}
        </p>
      )}

      <div className="dialog-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

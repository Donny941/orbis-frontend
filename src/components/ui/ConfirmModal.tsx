import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  icon,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  const iconColorClass = variant === "danger" ? "text-danger" : variant === "warning" ? "text-warning" : "text-primary";

  return createPortal(
    <>
      {/* Bootstrap backdrop */}
      <div className="modal-backdrop fade show" onClick={onCancel} />

      {/* Bootstrap modal */}
      <div ref={backdropRef} className="modal fade show d-block" tabIndex={-1} onClick={onCancel}>
        <div className="modal-dialog modal-dialog-centered modal-sm" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content orbis-confirm-modal">
            <div className="modal-body text-center p-4">
              {/* Icon */}
              <div className={`orbis-confirm-icon ${iconColorClass} mb-3`}>{icon || <AlertTriangle size={28} />}</div>

              {/* Title */}
              <h5 className="modal-title mb-2">{title}</h5>

              {/* Message */}
              <p className="orbis-confirm-message mb-4">{message}</p>

              {/* Actions */}
              <div className="d-flex gap-3">
                <button className="btn btn-secondary flex-fill" onClick={onCancel}>
                  {cancelText}
                </button>
                <button
                  className={`btn btn-${variant === "default" ? "primary" : variant === "danger" ? "danger" : "primary"} flex-fill`}
                  onClick={onConfirm}
                  autoFocus
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

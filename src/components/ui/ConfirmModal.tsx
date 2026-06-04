"use client";
import { FC, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import scss from "./ConfirmModal.module.scss";
import { motionTokens, springs } from "@/src/lib/motion-tokens";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  variant = "danger",
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => confirmRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape to cancel
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const Icon = variant === "danger" ? Trash2 : AlertTriangle;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={scss.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTokens.duration.fast }}
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            className={scss.modal}
            initial={{ opacity: 0, scale: 0.94, y: motionTokens.distance.md }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: motionTokens.distance.sm }}
            transition={springs.gentle}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button className={scss.closeBtn} onClick={onCancel} aria-label="Закрыть">
              <X size={16} />
            </button>

            {/* Icon */}
            <div className={`${scss.iconWrap} ${scss[variant]}`}>
              <Icon size={22} />
            </div>

            {/* Content */}
            <h2 id="confirm-title" className={scss.title}>{title}</h2>
            {message && <p className={scss.message}>{message}</p>}

            {/* Actions */}
            <div className={scss.actions}>
              <motion.button
                className={scss.cancelBtn}
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: motionTokens.scale.press }}
                transition={springs.snappy}
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                ref={confirmRef}
                className={`${scss.confirmBtn} ${scss[variant]}`}
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: motionTokens.scale.press }}
                transition={springs.snappy}
              >
                <Icon size={14} />
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

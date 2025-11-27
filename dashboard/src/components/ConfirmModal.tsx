import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  loading,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur"
          aria-modal
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
            {description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel} aria-label={cancelLabel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button
                onClick={onConfirm}
                aria-label={confirmLabel}
                disabled={loading}
                className="bg-red-500 hover:bg-red-400"
              >
                {loading ? "Working…" : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

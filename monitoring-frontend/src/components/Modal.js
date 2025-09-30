import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  // close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}

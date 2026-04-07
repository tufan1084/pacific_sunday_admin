"use client";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({ open, onClose, title, children, width = "460px" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#0b1326] to-[#0a1020] shadow-2xl"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#64748B] transition-colors hover:bg-white/5 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-2.5 p-4">{children}</div>
      </div>
    </div>
  );
}

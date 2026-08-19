import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export interface MoreSheetItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: MoreSheetItem[];
  accentColor?: string;
}

export default function MoreSheet({ isOpen, onClose, items, accentColor = "text-emerald-700" }: MoreSheetProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl"
        style={{ animation: "moreSheetSlideUp 0.25s ease-out forwards" }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">More Options</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 p-5 pb-10">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-95 transition cursor-pointer border border-slate-100"
            >
              <div className={accentColor}>{item.icon}</div>
              <span className="text-xs font-bold text-slate-700 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes moreSheetSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

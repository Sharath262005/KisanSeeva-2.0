import React from "react";

interface KSCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const KSCard = ({ children, className = "", onClick }: KSCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-lg border border-slate-100 p-6 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default KSCard;

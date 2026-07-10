import React from "react";

interface KSBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

const KSBadge = ({ children, variant = "neutral", className = "" }: KSBadgeProps) => {
  const baseStyle = "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";

  const variants = {
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    neutral: "bg-slate-100 text-slate-800 border border-slate-200",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default KSBadge;

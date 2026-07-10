import React from "react";

interface KSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

const KSButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}: KSButtonProps) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-green-700 text-white hover:bg-green-800 shadow-md hover:shadow-lg",

    secondary:
      "bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg",

    outline:
      "border border-green-700 text-green-700 hover:bg-green-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default KSButton;
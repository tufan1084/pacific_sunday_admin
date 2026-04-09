import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Button({ 
  variant = "primary", 
  children, 
  icon,
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "flex items-center gap-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-[#E6C36A] to-[#c9a84e] text-[#020617] shadow-lg shadow-[#E6C36A]/20 hover:shadow-xl hover:shadow-[#E6C36A]/30",
    secondary: "border border-white/[0.08] text-white hover:border-[#E6C36A]/50 hover:bg-[#E6C36A]/10",
    ghost: "text-white hover:bg-white/5"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ padding: "10px 15px", borderRadius: "5px" }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

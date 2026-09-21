// Harvested from: https://ui.shadcn.com/docs/components/button & https://beui.dev/components/motion/button.md
// Re-expressed on semantic tokens

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "emerald";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-slate-950 text-white hover:bg-slate-800 border border-transparent font-medium shadow-xs",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 shadow-xs",
      outline: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-xs",
      ghost: "bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent",
      destructive: "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold border border-transparent shadow-xs",
    };

    const sizes = {
      sm: "h-7 px-2.5 text-xs rounded",
      md: "h-9 px-3.5 text-xs rounded-md",
      lg: "h-11 px-5 text-sm rounded-lg",
      icon: "h-8 w-8 rounded-md p-0 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-mono transition-all select-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

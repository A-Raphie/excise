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
      primary: "bg-white text-black hover:bg-slate-200 border border-transparent font-medium shadow-sm",
      secondary: "bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white border border-white/[0.1]",
      outline: "bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white border border-white/[0.12]",
      ghost: "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent",
      destructive: "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40",
      emerald: "bg-emerald-500 text-black hover:bg-emerald-400 font-semibold border border-transparent shadow-sm",
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

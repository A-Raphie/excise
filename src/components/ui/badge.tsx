// Harvested from: https://ui.shadcn.com/docs/components/badge & https://coss.com/ui
// Re-expressed on semantic tokens

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "emerald" | "amber" | "purple" | "cyan";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    secondary: "bg-slate-50 text-slate-600 border-slate-200",
    destructive: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "border-slate-300 text-slate-700 bg-transparent",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
    cyan: "bg-sky-50 text-sky-800 border-sky-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

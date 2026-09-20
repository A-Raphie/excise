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
    default: "bg-white/[0.08] text-white border-white/[0.15]",
    secondary: "bg-white/[0.04] text-slate-300 border-white/[0.08]",
    destructive: "bg-rose-500/15 text-rose-300 border-rose-500/35",
    outline: "border-white/[0.12] text-slate-300 bg-transparent",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/35",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/35",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/35",
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

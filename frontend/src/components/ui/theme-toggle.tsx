"use client";

import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-1 shadow-sm">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
              active
                ? "bg-[color:var(--accent-soft)] text-[color:var(--text)]"
                : "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]",
            )}
            aria-pressed={active}
            aria-label={`Switch to ${option.label.toLowerCase()} theme`}
            title={`Theme: ${option.label}${option.value === "system" ? ` (${resolvedTheme})` : ""}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

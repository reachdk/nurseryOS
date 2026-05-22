import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--accent)]/40 bg-[var(--card)] p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: "good" | "warn" | "danger";
}) {
  const color =
    highlight === "good"
      ? "text-[var(--primary)]"
      : highlight === "warn"
        ? "text-[var(--warning)]"
        : highlight === "danger"
          ? "text-[var(--danger)]"
          : "text-[var(--foreground)]";

  return (
    <div className="text-center">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

export function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const base =
    "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
    secondary:
      "border border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--background)]",
    danger: "bg-[var(--danger)] text-white",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-lg border border-[var(--accent)] bg-white px-3 py-2.5 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full rounded-lg border border-[var(--accent)] bg-white px-3 py-2.5 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      {...props}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full rounded-lg border border-[var(--accent)] bg-white px-3 py-2.5 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
      rows={3}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "good" | "warn" | "danger";
}) {
  const tones = {
    default: "bg-[var(--background)] text-[var(--muted)]",
    good: "bg-[var(--accent)]/50 text-[var(--primary)]",
    warn: "bg-orange-100 text-[var(--warning)]",
    danger: "bg-red-100 text-[var(--danger)]",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

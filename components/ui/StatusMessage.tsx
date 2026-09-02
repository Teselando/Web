import type { ReactNode } from "react";

type StatusKind = "success" | "error" | "information" | "loading";

const markers: Record<StatusKind, string> = {
  success: "✓",
  error: "!",
  information: "i",
  loading: "…",
};

export function StatusMessage({ children, kind }: { children: ReactNode; kind: StatusKind }) {
  return <div className={`status-message status-message--${kind}`} role={kind === "error" ? "alert" : "status"}><span aria-hidden="true" className="status-message__marker">{markers[kind]}</span><span>{children}</span></div>;
}

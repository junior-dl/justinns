import { Badge } from "./ui";

export function StatusBadge({ status }: { status: "active" | "cancelled" | "completed" }) {
  return <Badge tone={status === "active" ? "pine" : status === "cancelled" ? "clay" : "neutral"}>{status === "active" ? "Upcoming" : status}</Badge>;
}

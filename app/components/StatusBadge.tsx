const COLORS: Record<string, string> = {
  active:    "#4ADE80",
  inactive:  "#EF4444",
  banned:    "#F87171",
  pending:   "#E6C36A",
  completed: "#4ADE80",
  live:      "#3B82F6",
  upcoming:  "#E6C36A",
  locked:    "#94A3B8",
  flagged:   "#F87171",
  hidden:    "#64748B",
  published: "#4ADE80",
  draft:     "#94A3B8",
  scheduled: "#3B82F6",
  won:       "#4ADE80",
  lost:      "#EF4444",
  draw:      "#E6C36A",
  low:       "#4ADE80",
  medium:    "#E6C36A",
  high:      "#EF4444",
};

export default function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const color = COLORS[s] || "#94A3B8";

  return (
    <span
      className="text-[11px] font-semibold normal-case tracking-wide"
      style={{ color }}
    >
      {status}
    </span>
  );
}

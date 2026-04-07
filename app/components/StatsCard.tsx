interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: string;
}

export default function StatsCard({ title, value, change, positive, icon }: StatsCardProps) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#0b1326] to-[#0a1020] transition-all hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/20" style={{ padding: "10px 16px 10px 30px", marginTop: "10px", marginBottom: "10px" }}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6C36A]/10 transition-all group-hover:bg-[#E6C36A]/15">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E6C36A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change && (
        <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-semibold ${positive ? "text-[#4ADE80]" : "text-[#EF4444]"}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {positive ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
          </svg>
          {positive ? "+" : ""}{change}
        </div>
      )}
    </div>
  );
}

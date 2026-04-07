interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-xs font-bold text-[#94A3B8]">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-sm text-white placeholder-[#64748B] outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10 ${props.className ?? ""}`}
      style={{ height: "44px", padding: "0 16px", marginBottom: "10px", marginTop: "5px" }}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-sm text-white outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10 ${props.className ?? ""}`}
      style={{ height: "44px", padding: "0 16px", marginBottom: "10px", marginTop: "5px" }}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-white/[0.08] bg-[#1A2235] text-sm text-white placeholder-[#64748B] outline-none transition-all focus:border-[#E6C36A]/50 focus:ring-2 focus:ring-[#E6C36A]/10 ${props.className ?? ""}`}
      style={{ padding: "12px 16px", minHeight: "100px", marginBottom: "10px", marginTop: "5px" }}
    />
  );
}

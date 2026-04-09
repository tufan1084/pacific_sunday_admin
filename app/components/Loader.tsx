interface LoaderProps {
  text?: string;
  fullPage?: boolean;
}

export default function Loader({ text = "Loading...", fullPage = false }: LoaderProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={fullPage ? { height: "calc(100vh - 120px)" } : { padding: "60px 20px" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="loader-dot" />
          <div className="loader-dot" />
          <div className="loader-dot" />
        </div>
        <p className="text-sm text-white/60">{text}</p>
      </div>
    </div>
  );
}

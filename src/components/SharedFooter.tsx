type SharedFooterProps = {
  className?: string;
};

export default function SharedFooter({ className = "" }: SharedFooterProps) {
  return (
    <footer
      className={`border-t border-white/10 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        Prompt Edit helps beginners master real editing skills.
      </div>
      <div className="flex items-center gap-4">
        <span>About</span>
        <span>Features</span>
        <span>Support</span>
      </div>
    </footer>
  );
}

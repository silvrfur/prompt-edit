import { motion } from "framer-motion";

type LandingProps = {
  onStart: () => void;
};

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#050712] text-slate-100 flex items-stretch justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-[15%] h-96 w-96 bg-cyan-500/20 blur-[140px] animate-[glowPulse_9s_ease-in-out_infinite]" />
        <div className="absolute -bottom-48 right-[10%] h-[30rem] w-[30rem] bg-amber-400/20 blur-[160px] animate-[glowPulse_12s_ease-in-out_infinite]" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 flex flex-col gap-10 lg:gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-center gap-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200 w-max">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              AI-powered learning
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                Learn editing with{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 bg-clip-text text-transparent">
                  Prompt Edit
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Prompt Edit is an AI-first coach for beginners who want to learn
                editing without getting lost in endless tools. It never edits your
                photo for you. Instead, it recommends the right tools and
                step-by-step values so you build real skills.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                <p className="text-slate-100 font-semibold text-sm">
                  Beginner-first
                </p>
                <p className="mt-1 text-slate-400">
                  Clear steps, no jargon, no black-box edits.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
                <p className="text-slate-100 font-semibold text-sm">
                  Human control
                </p>
                <p className="mt-1 text-slate-400">
                  You move every slider and learn why it matters.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 sm:col-span-2">
                <p className="text-slate-100 font-semibold text-sm">
                  Tool matching
                </p>
                <p className="mt-1 text-slate-400">
                  Only show the UI controls you actually need, based on your prompt.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="relative w-full max-w-md lg:ml-auto"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 bg-amber-400/20 blur-3xl" />

            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Prompt Edit Studio
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="h-6 px-2 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center">
                    Load
                  </span>
                  <span className="h-6 px-2 rounded-full bg-cyan-500 text-slate-950 font-medium flex items-center justify-center">
                    Download
                  </span>
                </div>
              </div>
              <div className="p-4 flex gap-3">
                <div className="flex-1 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex flex-col gap-2 p-3 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Active tools</span>
                    <span className="text-emerald-400">3 enabled</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["Brightness", "Color Filter", "Sharpen"].map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[10px]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                    <p className="text-[11px] text-slate-300">Next suggestion</p>
                    <p className="text-sm text-slate-100 font-medium">
                      Brightness +12, Saturation +8
                    </p>
                  </div>
                </div>
                <div className="w-44 rounded-2xl bg-slate-900/90 border border-slate-700/70 flex flex-col">
                  <div className="px-3 py-2 border-b border-slate-700/70 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>AI Mentor</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-3 space-y-2 text-[11px]">
                    <div className="self-end max-w-[80%] ml-auto rounded-2xl bg-cyan-500/90 text-slate-950 px-3 py-1.5">
                      Make this sunset more vibrant.
                    </div>
                    <div className="max-w-[90%] rounded-2xl bg-slate-800 px-3 py-2 text-slate-100">
                      Great choice! Try:
                      <ol className="mt-1 list-decimal list-inside space-y-0.5">
                        <li>Brightness to +12.</li>
                        <li>Color filter: Warm 20.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
              <div>
                <span className="font-semibold text-cyan-300">15+ </span>
                Filter effects
              </div>
              <div>
                <span className="font-semibold text-cyan-300">8 </span>
                Drawing tools
              </div>
              <div>
                <span className="font-semibold text-cyan-300">Infinite </span>
                AI guidance steps
              </div>
            </div>
          </motion.section>
        </div>

        <motion.button
          type="button"
          onClick={onStart}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -1 }}
          className="mx-auto w-full sm:w-[320px] inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium bg-gradient-to-r from-cyan-400 via-sky-500 to-amber-400 text-slate-950 shadow-[0_16px_40px_rgba(8,47,73,0.9)] cursor-pointer"
        >
          Start editing now
        </motion.button>

        <footer className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
      </div>
    </div>
  );
}

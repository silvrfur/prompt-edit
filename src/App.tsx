import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Landing from "./components/Landing";
import Chat from "./components/Chat";
import MyImageEditor from "./components/ImageEditor";
import type { EditorHandle } from "./components/ImageEditor";
import "./App.css";
import botIcon from "./assets/bot.png";
import { buildPlan, type PromptPlan } from "./lib/buildPlan";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const sliderRanges: Record<string, { min: number; max: number }> = {
  Brightness: { min: -30, max: 30 },
  Sharpen: { min: 0, max: 30 },
  Blur: { min: 0, max: 10 },
  Noise: { min: 0, max: 30 },
  Pixelate: { min: 1, max: 20 },
  "Color Filter": { min: 0, max: 30 },
};

export default function App() {
  const [mode, setMode] = useState<"landing" | "editor">("landing");
  const [plan, setPlan] = useState<PromptPlan | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, number>>(
    {}
  );
  const [controlChecks, setControlChecks] = useState<Record<string, boolean>>(
    {}
  );
  const editorRef = useRef<EditorHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleRecommend = (text: string) => {
    const next = buildPlan(text);
    setPlan(next);
    if (next) {
      const nextValues: Record<string, number> = {};
      const nextChecks: Record<string, boolean> = {};
      next.tools.forEach((tool) => {
        if (tool.control === "slider") {
          const numeric = Number(tool.value.replace(/[^\-0-9.]/g, ""));
          const range = sliderRanges[tool.name] ?? { min: -30, max: 30 };
          const safeValue = Number.isFinite(numeric) ? numeric : 0;
          nextValues[tool.name] = clamp(safeValue, range.min, range.max);
        } else {
          nextChecks[tool.name] = tool.value.toLowerCase() === "on";
        }
      });
      setControlValues(nextValues);
      setControlChecks(nextChecks);
    }
  };

  const toolSummary = useMemo(() => {
    if (!plan) return null;
    return plan.tools.map((t) => t.name).join(", ");
  }, [plan]);

  if (mode === "landing") {
    return <Landing onStart={() => setMode("editor")} />;
  }

  const applyFilter = (name: string, value: number) => {
    const editor = editorRef.current;
    if (!editor) return;

    // ensure filter module is active
    editor.ui?.activeMenuEvent("filter");

    if (name === "Brightness") {
      editor.removeFilter("brightness");
      editorRef.current?.applyFilter("Brightness", { brightness: value });
    }
    if (name === "Sharpen") {
      editorRef.current?.applyFilter("Sharpen", { level: Math.max(0, value) });
    }
    if (name === "Blur") {
      editorRef.current?.applyFilter("Blur", { blur: Math.max(0, value) / 10 });
    }
    if (name === "Noise") {
      editorRef.current?.applyFilter("Noise", { noise: Math.max(0, value) / 100 });
    }
    if (name === "Pixelate") {
      editorRef.current?.applyFilter("Pixelate", { pixelate: Math.max(1, Math.abs(value)) });
    }
    if (name === "Color Filter") {
      editorRef.current?.applyFilter("ColorFilter", {
        type: "tint",
        color: "#ff9f43",
        opacity: Math.min(1, Math.max(0.1, Math.abs(value) / 30)),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050712] text-slate-100 flex items-stretch justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-[10%] h-80 w-80 bg-cyan-500/20 blur-[120px] animate-[glowPulse_9s_ease-in-out_infinite]" />
        <div className="absolute -bottom-44 right-[8%] h-96 w-96 bg-rose-500/20 blur-[140px] animate-[glowPulse_11s_ease-in-out_infinite]" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col gap-4">
        <header className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_18px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode("landing")}
              className="text-xs text-slate-400 hover:text-slate-100 transition flex items-center gap-2"
              aria-label="Back to landing"
            >
              <span className="text-lg">&lt;</span>
            </button>
            <div className="h-7 w-7 rounded-full overflow-hidden bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
              <img src={botIcon} alt="Bot" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold">Prompt Edit Studio</p>
              <p className="text-[11px] text-slate-400">
                Guided editing, fully human controlled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span>Buzz is online</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                editorRef.current?.loadImage(file);
              }}
            />
            <button
              className="group h-7 px-3 rounded-full border border-slate-600/70 bg-slate-900/80 text-slate-200 text-xs inline-flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:text-cyan-100 hover:shadow-[0_10px_24px_rgba(34,211,238,0.2)] active:translate-y-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>Load</span>
              <svg
                viewBox="0 0 14 14"
                className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 3h6v6" />
                <path d="M11 3 3 11" />
              </svg>
            </button>
            <button
              className="group h-7 px-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-medium text-xs shadow-[0_12px_30px_rgba(251,191,36,0.5)] inline-flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(251,146,60,0.55)] active:translate-y-0"
              onClick={() => editorRef.current?.download()}
            >
              <span>Download</span>
              <svg
                viewBox="0 0 14 14"
                className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 3h6v6" />
                <path d="M11 3 3 11" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-5">
          <motion.section
            className="flex-1 rounded-3xl relative overflow-hidden bg-gradient-to-b from-white/5 via-white/3 to-white/[0.02] border border-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-32 -right-16 h-64 w-64 bg-cyan-500/20 blur-3xl" />
              <div className="absolute -bottom-40 -left-16 h-64 w-64 bg-rose-500/20 blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="px-4 sm:px-5 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  <span>Editor Playground</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5">
                    Toast UI engine
                  </span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                    You make every change
                  </span>
                </div>
              </div>

              <div className="px-4 sm:px-5 py-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">
                    <span>Generated controls</span>
                    {plan ? (
                      <span className="text-slate-300">
                        Based on: "{plan.prompt}"
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Ask the AI mentor to generate controls
                      </span>
                    )}
                  </div>

                  {plan ? (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {plan.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="rounded-xl border border-white/10 bg-black/40 px-3 py-3"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-200">
                            <span className="font-medium">{tool.name}</span>
                            <span className="text-slate-400">{tool.value}</span>
                          </div>
                          {tool.control === "slider" ? (
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                className="px-2 py-1 rounded-md bg-slate-800 border border-white/10 text-xs"
                                onClick={() => {
                                  const range = sliderRanges[tool.name] ?? { min: -30, max: 30 };
                                  const next = clamp((controlValues[tool.name] ?? 0) - 1, range.min, range.max);
                                  setControlValues((prev) => ({ ...prev, [tool.name]: next }));
                                  applyFilter(tool.name, next);
                                }}
                              >
                                -
                              </button>

                              <input
                                type="number"
                                className="w-16 bg-slate-900 border border-white/10 rounded-md px-2 py-1 text-xs text-slate-200"
                                value={controlValues[tool.name] ?? 0}
                                onChange={(e) => {
                                  const range = sliderRanges[tool.name] ?? { min: -30, max: 30 };
                                  const next = clamp(Number(e.target.value), range.min, range.max);
                                  setControlValues((prev) => ({ ...prev, [tool.name]: next }));
                                  applyFilter(tool.name, next);
                                }}
                              />

                              <button
                                className="px-2 py-1 rounded-md bg-slate-800 border border-white/10 text-xs"
                                onClick={() => {
                                  const range = sliderRanges[tool.name] ?? { min: -30, max: 30 };
                                  const next = clamp((controlValues[tool.name] ?? 0) + 1, range.min, range.max);
                                  setControlValues((prev) => ({ ...prev, [tool.name]: next }));
                                  applyFilter(tool.name, next);
                                }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <label className="mt-2 inline-flex items-center gap-2 text-[11px] text-slate-300">
                              <input
                                type="checkbox"
                                className="accent-cyan-400"
                                checked={controlChecks[tool.name] ?? false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setControlChecks((prev) => ({
                                    ...prev,
                                    [tool.name]: checked,
                                  }));
                                  if (checked) {
                                    editorRef.current?.applyFilter(tool.name);
                                  } else {
                                    editorRef.current?.removeFilter(tool.name);
                                  }
                                }}
                              />
                              Enable
                            </label>
                          )}
                          <p className="mt-2 text-[11px] text-slate-400">
                            {tool.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-4 text-[11px] text-slate-400">
                      Start by describing your edit in the chat. We will surface
                      only the Toast UI controls you need.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 px-3 sm:px-4 pb-4">
                <div className="w-full h-full rounded-2xl bg-[#050816] border border-white/10 overflow-hidden">
                  <MyImageEditor ref={editorRef} />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="w-full lg:max-w-sm xl:max-w-md flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          >
            <Chat onRecommend={handleRecommend} plan={plan} toolSummary={toolSummary} />
          </motion.section>
        </div>
      </div>
    </div>
  );
}

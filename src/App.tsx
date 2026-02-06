import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Landing from "./components/Landing";
import Chat from "./components/Chat";
import MyImageEditor from "./components/ImageEditor";
import type { EditorHandle } from "./components/ImageEditor";
import "./App.css";
import botIcon from "./assets/bot.png";

type ToolSuggestion = {
  name: string;
  value: string;
  percent: number;
  reason: string;
  control: "checkbox" | "slider";
};

type PromptPlan = {
  prompt: string;
  summary: string;
  tools: ToolSuggestion[];
};

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

function buildPlan(prompt: string): PromptPlan | null {
  const cleaned = prompt.trim();
  if (!cleaned) return null;
  const text = cleaned.toLowerCase();

  const tools: ToolSuggestion[] = [];
  const add = (t: ToolSuggestion) => {
    if (!tools.find((x) => x.name === t.name)) tools.push(t);
  };

  if (/(vibrant|vivid|pop|color|colorful|saturat)/.test(text)) {
    add({
      name: "Color Filter",
      value: "Warm 20",
      percent: 65,
      reason: "Boosts color energy without clipping highlights.",
      control: "slider",
    });
    add({
      name: "Brightness",
      value: "+12",
      percent: 55,
      reason: "Lifts midtones for a cleaner, brighter feel.",
      control: "slider",
    });
    add({
      name: "Sharpen",
      value: "+8",
      percent: 40,
      reason: "Adds clarity so details feel crisper.",
      control: "slider",
    });
  }

  if (/(dark|dim|underexposed|brighten|exposure|lighten)/.test(text)) {
    add({
      name: "Brightness",
      value: "+18",
      percent: 70,
      reason: "Raises overall exposure for readability.",
      control: "slider",
    });
  }

  if (/(cinematic|warm|golden|sunset)/.test(text)) {
    add({
      name: "Color Filter",
      value: "Warm 25",
      percent: 70,
      reason: "Warms highlights to create cinematic tones.",
      control: "slider",
    });
  }

  if (/(soft|dreamy|haze)/.test(text)) {
    add({
      name: "Blur",
      value: "4",
      percent: 25,
      reason: "Softens harsh edges for a dreamy look.",
      control: "slider",
    });
  }

  if (/(sharp|clarity|detail)/.test(text)) {
    add({
      name: "Sharpen",
      value: "+14",
      percent: 75,
      reason: "Improves micro-contrast on edges.",
      control: "slider",
    });
  }

  if (/(grain|noise|film)/.test(text)) {
    add({
      name: "Noise",
      value: "+10",
      percent: 55,
      reason: "Adds controlled texture for film-like grain.",
      control: "slider",
    });
  }

  if (/(black and white|bw|monochrome|grayscale)/.test(text)) {
    add({
      name: "Grayscale",
      value: "On",
      percent: 100,
      reason: "Removes color for a true monochrome look.",
      control: "checkbox",
    });
  }

  if (/(vintage|retro|sepia)/.test(text)) {
    add({
      name: "Sepia",
      value: "On",
      percent: 100,
      reason: "Adds warm vintage tones.",
      control: "checkbox",
    });
  }

  if (/(pixel|pixelate|mosaic)/.test(text)) {
    add({
      name: "Pixelate",
      value: "12",
      percent: 60,
      reason: "Creates a stylized mosaic effect.",
      control: "slider",
    });
  }

  if (/(invert|negative)/.test(text)) {
    add({
      name: "Invert",
      value: "On",
      percent: 100,
      reason: "Flips tones for a negative-style look.",
      control: "checkbox",
    });
  }

  if (tools.length === 0) {
    add({
      name: "Brightness",
      value: "+8",
      percent: 40,
      reason: "A safe first adjustment for most photos.",
      control: "slider",
    });
    add({
      name: "Sharpen",
      value: "+6",
      percent: 30,
      reason: "Adds subtle detail without harshness.",
      control: "slider",
    });
  }

  return {
    prompt: cleaned,
    summary: "Recommended adjustments generated from your prompt.",
    tools,
  };
}

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
              <span className="text-lg">&lt;-</span>
            </button>
            <div className="h-7 w-7 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
              <img src={botIcon} alt="Bot" className="h-4 w-4" />
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
              <span>AI Mentor online</span>
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
              className="h-7 px-3 rounded-full border border-slate-600/70 bg-slate-900/80 text-slate-200 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Load
            </button>
            <button
              className="h-7 px-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-medium text-xs shadow-[0_12px_30px_rgba(251,191,36,0.5)]"
              onClick={() => editorRef.current?.download()}
            >
              Download
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
                      <span className="text-slate-500">
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
                              <input
                                type="range"
                                min={sliderRanges[tool.name]?.min ?? -30}
                                max={sliderRanges[tool.name]?.max ?? 30}
                                value={controlValues[tool.name] ?? 0}
                                onChange={(e) => {
                                  const range =
                                    sliderRanges[tool.name] ?? {
                                      min: -30,
                                      max: 30,
                                    };
                                  const next = clamp(
                                    Number(e.target.value),
                                    range.min,
                                    range.max
                                  );
                                  setControlValues((prev) => ({
                                    ...prev,
                                    [tool.name]: next,
                                  }));
                                  if (tool.name === "Brightness") {
                                    editorRef.current?.applyFilter("Brightness", {
                                      brightness: next,
                                    });
                                  }
                                  if (tool.name === "Sharpen") {
                                    editorRef.current?.applyFilter("Sharpen", {
                                      level: Math.max(0, next),
                                    });
                                  }
                                  if (tool.name === "Blur") {
                                    editorRef.current?.applyFilter("Blur", {
                                      blur: Math.max(0, next) / 10,
                                    });
                                  }
                                  if (tool.name === "Noise") {
                                    editorRef.current?.applyFilter("Noise", {
                                      noise: Math.max(0, next) / 100,
                                    });
                                  }
                                  if (tool.name === "Pixelate") {
                                    editorRef.current?.applyFilter("Pixelate", {
                                      pixelate: Math.max(1, Math.abs(next)),
                                    });
                                  }
                                  if (tool.name === "Color Filter") {
                                    editorRef.current?.applyFilter("ColorFilter", {
                                      type: "tint",
                                      color: "#ff9f43",
                                      opacity: Math.min(
                                        1,
                                        Math.max(0.1, Math.abs(next) / 30)
                                      ),
                                    });
                                  }
                                }}
                                className="flex-1 accent-cyan-400"
                              />
                              <span className="text-[11px] text-slate-400 w-10 text-right">
                                {controlValues[tool.name] ?? 0}
                              </span>
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
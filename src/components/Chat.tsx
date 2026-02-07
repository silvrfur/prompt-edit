import { useState } from "react";
import { useTamboThreadInput } from "@tambo-ai/react";
import { motion, AnimatePresence } from "framer-motion";
import botIcon from "../assets/bot.png";

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

type ChatProps = {
  onRecommend: (text: string) => void;
  plan: PromptPlan | null;
  toolSummary: string | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chat({ onRecommend, plan, toolSummary }: ChatProps) {
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Tell me what you want to achieve. I will recommend the exact tools and approximate values, and explain why each step helps.",
    },
  ]);

  return (
    <section className="h-full rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <img src={botIcon} alt="Bot" className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-100">Buzz Bot</p>
            <p className="text-[11px] text-slate-400">Editing steps, not edits</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          Online
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar text-[13px]">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyan-500/90 text-slate-950"
                    : "bg-black/40 border border-white/10 text-slate-100"
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isPending && (
          <div className="text-[11px] text-slate-400 italic">Thinking...</div>
        )}

        {plan && (
          <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-xs text-slate-200">
            <p className="text-[11px] text-emerald-300">
              Recommendation based on "{plan.prompt}"
            </p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-slate-100">
              {plan.tools.map((tool) => (
                <li key={tool.name}>
                  {tool.name}: <strong>{tool.value}</strong> — {tool.reason}
                </li>
              ))}
            </ol>
            {toolSummary && (
              <p className="mt-2 text-[11px] text-slate-400">
                Showing controls: {toolSummary}
              </p>
            )}
          </div>
        )}
      </div>

      <form
        className="px-3 py-2 border-t border-white/10 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = value.trim();
          if (!trimmed) return;
          setMessages((prev) => [
            ...prev,
            { id: `u-${Date.now()}`, role: "user", content: trimmed },
          ]);
          onRecommend(trimmed);
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content:
                "Got it. I have generated the exact tools and suggested values. Review the recommendation below and apply each step in order.",
            },
          ]);
          submit();
        }}
      >
        <div className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              setValue(next);
            }}
            placeholder="Ask how to edit..."
            className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
          />
          <motion.button
            type="submit"
            disabled={isPending || !value.trim()}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl px-3 py-2 text-xs font-medium bg-gradient-to-r from-cyan-400 via-sky-500 to-amber-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </motion.button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
          Buzz never edits for you. It recommends tools, values, and why.
        </div>
      </form>
    </section>
  );
}

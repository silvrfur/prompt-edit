export type ToolSuggestion = {
  name: string;
  value: string;
  percent: number;
  reason: string;
  control: "checkbox" | "slider";
};

export type PromptPlan = {
  prompt: string;
  summary: string;
  tools: ToolSuggestion[];
};

const addUnique = (tools: ToolSuggestion[], t: ToolSuggestion) => {
  if (!tools.find((x) => x.name === t.name)) tools.push(t);
};

export function buildPlan(prompt: string): PromptPlan | null {
  const cleaned = prompt.trim();
  if (!cleaned) return null;
  const text = cleaned.toLowerCase();

  const tools: ToolSuggestion[] = [];

  if (/(cinematic|movie|film look|teal and orange|golden hour)/.test(text)) {
    addUnique(tools, {
      name: "Brightness",
      value: "+8",
      percent: 50,
      reason: "Lifts exposure slightly while keeping contrast.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Color Filter",
      value: "Warm 22",
      percent: 70,
      reason: "Adds warm highlights for a cinematic tone.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Sharpen",
      value: "+10",
      percent: 65,
      reason: "Brings out edge detail like a graded film still.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Noise",
      value: "+6",
      percent: 40,
      reason: "Adds subtle grain for a film-like texture.",
      control: "slider",
    });
  }

  if (/(pinterest|aesthetic|pinteresty|soft vibe|cozy)/.test(text)) {
    addUnique(tools, {
      name: "Brightness",
      value: "+12",
      percent: 65,
      reason: "Brightens the scene for a soft, airy feel.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Color Filter",
      value: "Warm 18",
      percent: 60,
      reason: "Adds gentle warmth for a friendly aesthetic.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Blur",
      value: "2",
      percent: 25,
      reason: "Softens edges slightly for a dreamy look.",
      control: "slider",
    });
  }

  if (/(moody|dark vibe|dramatic shadows|low key)/.test(text)) {
    addUnique(tools, {
      name: "Brightness",
      value: "-10",
      percent: 60,
      reason: "Pulls the image darker for moodier contrast.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Color Filter",
      value: "Cool 18",
      percent: 55,
      reason: "Shifts tones cooler for a moody palette.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Sharpen",
      value: "+8",
      percent: 45,
      reason: "Keeps details crisp in the shadows.",
      control: "slider",
    });
  }

  if (/(dreamy|soft|hazy|ethereal)/.test(text)) {
    addUnique(tools, {
      name: "Blur",
      value: "4",
      percent: 40,
      reason: "Softens edges for a dreamy, hazy feel.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Brightness",
      value: "+6",
      percent: 40,
      reason: "Gently lifts exposure to keep it light.",
      control: "slider",
    });
  }

  if (/(film|grainy|analog|retro)/.test(text)) {
    addUnique(tools, {
      name: "Noise",
      value: "+12",
      percent: 70,
      reason: "Adds visible grain for an analog feel.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Color Filter",
      value: "Warm 20",
      percent: 60,
      reason: "Warms tones like classic film stocks.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Fade",
      value: "+8",
      percent: 50,
      reason: "Softens blacks for a faded film look.",
      control: "slider",
    });
  }

  if (/(vibrant|vivid|pop|color|colorful|saturat)/.test(text)) {
    addUnique(tools, {
      name: "Color Filter",
      value: "Warm 20",
      percent: 65,
      reason: "Boosts color energy without clipping highlights.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Brightness",
      value: "+12",
      percent: 55,
      reason: "Lifts midtones for a cleaner, brighter feel.",
      control: "slider",
    });
    addUnique(tools, {
      name: "Sharpen",
      value: "+8",
      percent: 40,
      reason: "Adds clarity so details feel crisper.",
      control: "slider",
    });
  }

  if (/(dark|dim|underexposed|brighten|exposure|lighten)/.test(text)) {
    addUnique(tools, {
      name: "Brightness",
      value: "+18",
      percent: 70,
      reason: "Raises overall exposure for readability.",
      control: "slider",
    });
  }

  if (/(soft|dreamy|haze)/.test(text)) {
    addUnique(tools, {
      name: "Blur",
      value: "4",
      percent: 25,
      reason: "Softens harsh edges for a dreamy look.",
      control: "slider",
    });
  }

  if (/(sharp|clarity|detail)/.test(text)) {
    addUnique(tools, {
      name: "Sharpen",
      value: "+14",
      percent: 75,
      reason: "Improves micro-contrast on edges.",
      control: "slider",
    });
  }

  if (/(grain|noise|film)/.test(text)) {
    addUnique(tools, {
      name: "Noise",
      value: "+10",
      percent: 55,
      reason: "Adds controlled texture for film-like grain.",
      control: "slider",
    });
  }

  if (/(black and white|bw|monochrome|grayscale)/.test(text)) {
    addUnique(tools, {
      name: "Grayscale",
      value: "On",
      percent: 100,
      reason: "Removes color for a true monochrome look.",
      control: "checkbox",
    });
  }

  if (/(vintage|retro|sepia)/.test(text)) {
    addUnique(tools, {
      name: "Sepia",
      value: "On",
      percent: 100,
      reason: "Adds warm vintage tones.",
      control: "checkbox",
    });
  }

  if (/(pixel|pixelate|mosaic)/.test(text)) {
    addUnique(tools, {
      name: "Pixelate",
      value: "12",
      percent: 60,
      reason: "Creates a stylized mosaic effect.",
      control: "slider",
    });
  }

  if (/(invert|negative)/.test(text)) {
    addUnique(tools, {
      name: "Invert",
      value: "On",
      percent: 100,
      reason: "Flips tones for a negative-style look.",
      control: "checkbox",
    });
  }

  if (tools.length === 0) {
    addUnique(tools, {
      name: "Brightness",
      value: "+8",
      percent: 40,
      reason: "A safe first adjustment for most photos.",
      control: "slider",
    });
    addUnique(tools, {
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
import { TOOL_TO_TUI } from "./toolMap";
import { getEditorBridgeHandle } from "./editorBridge";

export function applyTool(editorRef: any, toolId: string, value: number) {
  const editor = editorRef?.current ?? getEditorBridgeHandle();
  if (!editor) return;

  editor.ui?.activeMenuEvent?.("filter");

  const normalizedToolId = normalizeToolId(toolId);
  const filterName = TOOL_TO_TUI[normalizedToolId];
  if (!filterName) {
    console.warn(`No mapping found for toolId: ${toolId}`);
    return;
  }

  let options: any = {};
  switch (filterName) {
    case "brightness":
      options = { brightness: normalizeBrightness(value) };
      break;
    case "noise":
      options = { noise: Math.max(0, Math.round(value)) };
      break;
    case "pixelate":
      options = { blocksize: clamp(Math.round(value), 2, 20) };
      break;
    case "removeWhite":
      options = {
        color: "#FFFFFF",
        useAlpha: false,
        distance: normalizeThreshold(value),
      };
      break;
    case "colorFilter":
      options = {
        color: "#FFFFFF",
        distance: normalizeThreshold(value),
      };
      break;
    case "blur":
      options = { blur: normalizeBlur(value) };
      break;
    case "sharpen":
      options = {};
      break;
    default:
      options = {};
  }

  try {
    editor.applyFilter(filterName, options);
    } catch (err: any) {
    if (String(err).includes("locked")) {
        setTimeout(() => {
        editor.applyFilter(filterName, options);
        }, 200);
    } else {
        console.error(`Failed to apply filter ${filterName}`, err);
    }
  }
}

const TOOL_ALIASES: Record<string, string> = {
  removewhite: "removeWhite",
  remove_white: "removeWhite",
  "remove white": "removeWhite",
  colorfilter: "colorFilter",
  color_filter: "colorFilter",
  "color filter": "colorFilter",
  threshold: "colorFilter",
};

function normalizeToolId(toolId: string) {
  const raw = String(toolId ?? "").trim();
  const lowered = raw.toLowerCase();
  return TOOL_ALIASES[lowered] ?? lowered.replace(/[\s_-]/g, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeThreshold(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value >= 0 && value <= 1) return value;
  return clamp(value / 100, 0, 1);
}

function normalizeBrightness(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value >= -1 && value <= 1) return value;
  return clamp(value / 30, -1, 1);
}

function normalizeBlur(value: number) {
  if (!Number.isFinite(value)) return 0.1;
  if (value >= 0 && value <= 1) return value;
  return clamp(value / 10, 0, 1);
}

import { TOOL_TO_TUI } from "./toolMap";

export function applyTool(editorRef: any, toolId: string, value: number) {
  if (!editorRef?.current) return;

  const filterName = TOOL_TO_TUI[toolId];
  if (!filterName) {
    console.warn(`No mapping found for toolId: ${toolId}`);
    return;
  }

  let options: any = {};
  switch (filterName) {
    case "sharpen":
      options = { amount: value };
      break;
    case "pixelate":
      options = { blockSize: value };
      break;
    case "removeWhite":
      options = { threshold: value, distance: 50 }; // example defaults
      break;
    case "colorFilter":
      options = { color: [255, 0, 0], value }; // example red tint
      break;
    default:
      options = { value };
  }

  try {
    editorRef.current.applyFilter(filterName, options);
    } catch (err: any) {
    if (String(err).includes("locked")) {
        setTimeout(() => {
        editorRef.current.applyFilter(filterName, options);
        }, 200);
    } else {
        console.error(`Failed to apply filter ${filterName}`, err);
    }
  }
}
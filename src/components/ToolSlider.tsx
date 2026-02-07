import { useState, type RefObject } from "react";
import { applyTool } from "../lib/applyTool";

type ToolSliderProps = {
  toolId?: string;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  editorRef?: RefObject<any>;
};

export default function ToolSlider({
  toolId,
  label,
  description,
  min,
  max,
  defaultValue,
  editorRef,
}: ToolSliderProps) {
  const [value, setValue] = useState(defaultValue ?? 0);

  function handleChange(v: number) {
    setValue(v);
    if (!toolId) return;
    applyTool(editorRef, toolId, v);
  }

  return (
    <div style={{ background: "#1f1f1f", padding: 10, borderRadius: 8, marginBottom: 10, color: "white" }}>
      <div style={{ fontWeight: 600 }}>{label ?? toolId ?? "Tool"}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{description ?? "Adjust value"}</div>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        value={value}
        style={{ width: "100%" }}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <div style={{ fontSize: 11, opacity: 0.6 }}>Value: {value}</div>
    </div>
  );
}

import { useState, type RefObject } from "react";
import { applyTool } from "../lib/applyTool";

type ToolSliderProps = {
  toolId: string;
  label: string;
  description: string;
  min: number;
  max: number;
  defaultValue: number;
  editorRef: RefObject<any>; // ref passed down from App
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
  const [value, setValue] = useState(defaultValue);

  function handleChange(v: number) {
    console.log("Slider change:", toolId, v);
    setValue(v);
    applyTool(editorRef, toolId, v);
  }

  return (
    <div style={{ background: "#1f1f1f", padding: 10, borderRadius: 8, marginBottom: 10, color: "white" }}>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{description}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ width: "100%" }}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <div style={{ fontSize: 11, opacity: 0.6 }}>Value: {value}</div>
    </div>
  );
}
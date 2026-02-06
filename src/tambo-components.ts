import { z } from "zod";
import ToolSlider from "./components/ToolSlider";

export const tamboComponents = [
  {
    name: "ToolSlider",
    description: "A slider for adjusting an image editing parameter",
    component: ToolSlider,
    propsSchema: z.object({
      toolId: z.string().optional(),
      label: z.string().optional(),
      description: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      defaultValue: z.number().optional(),
    }),
  },
];
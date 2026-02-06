import { useEffect, useRef } from "react";
import ImageEditor from "tui-image-editor";

export default function MyImageEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const myTheme: any = {
  "common.bi.image": "",
  "common.bi.name": "PromptEdit",
};

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: "https://picsum.photos/800/500",
          name: "SampleImage",
        },
        menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
        initMenu: "filter",
        uiSize: {
          width: "100%",
          height: "700px",
        },
        menuBarPosition: "bottom",
        theme:myTheme,
      },
      cssMaxWidth: 800,
      cssMaxHeight: 700,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }}/>;
}

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import ImageEditor from "tui-image-editor";

const MyImageEditor = forwardRef((props, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
  applyFilter: (filterName: string, options: any) => {
    console.log("applyFilter invoked:", filterName, options);
    if (instanceRef.current) {
      instanceRef.current.applyFilter(filterName, options)
        .then(() => console.log("Filter applied successfully"))
        .catch((err: any) => console.error("Filter failed:", err));
    }
  },
}));

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: "https://picsum.photos/800/500",
          name: "SampleImage",
        },
        menu: ["filter"],
        initMenu: "filter",
        uiSize: { width: "100%", height: "700px" },
        menuBarPosition: "bottom",
      },
      cssMaxWidth: 800,
      cssMaxHeight: 700,
    });

    instanceRef.current = editor;

    editor.on("ready", () => {
      console.log("Editor is ready, filters can be applied");
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }} />;
});

export default MyImageEditor;
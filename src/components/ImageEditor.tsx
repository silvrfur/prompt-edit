import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import ImageEditor from "tui-image-editor";

export type EditorHandle = {
  loadImage: (file: File) => Promise<void>;
  download: () => void;
  applyFilter: (name: string, options?: any) => void;
  removeFilter: (name: string) => void;
};

const MyImageEditor = forwardRef<EditorHandle>((_, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<ImageEditor | null>(null);
  const myTheme: any = {
    "common.bi.image": "",
    "common.bi.name": "Prompt Edit",
    "common.backgroundColor": "#0a0f1f",
    "common.border": "1px solid rgba(255,255,255,0.08)",
    "menu.normalIcon.color": "#9fb0c4",
    "menu.activeIcon.color": "#2de2e6",
    "menu.disabledIcon.color": "#48556a",
    "menu.hoverIcon.color": "#6fe7ea",
    "menu.iconSize.width": "24px",
    "menu.iconSize.height": "24px",
    "submenu.backgroundColor": "#0b1122",
    "submenu.partition.color": "rgba(255,255,255,0.08)",
    "submenu.normalLabel.color": "#9fb0c4",
    "submenu.activeLabel.color": "#ffffff",
    "submenu.iconSize.width": "26px",
    "submenu.iconSize.height": "26px",
  };

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
        uiSize: {
          width: "100%",
          height: "720px",
        },
        menuBarPosition: "bottom",
        theme: myTheme,
      },
      cssMaxWidth: 800,
      cssMaxHeight: 700,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });
    instanceRef.current = editor;

    return () => {
      editor.destroy();
      instanceRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    loadImage: async (file: File) => {
      if (!instanceRef.current) return;
      await instanceRef.current.loadImageFromFile(file, file.name);
    },
    download: () => {
      if (!instanceRef.current) return;
      const dataUrl = instanceRef.current.toDataURL();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "prompt-edit.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    applyFilter: (name, options) => {
      if (!instanceRef.current) return;
      instanceRef.current.applyFilter(name as any, options as any);
    },
    removeFilter: (name) => {
      if (!instanceRef.current) return;
      instanceRef.current.removeFilter(name);
    },
  }));

  return <div ref={editorRef} style={{ height: "100%", width: "100%" }} />;
});

MyImageEditor.displayName = "MyImageEditor";

export default MyImageEditor;
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import ImageEditor from "tui-image-editor";
import { setEditorBridgeHandle } from "../lib/editorBridge";

export type EditorHandle = {
  loadImage: (file: File) => Promise<void>;
  download: () => void;
  applyFilter: (name: string, options?: any) => void;
  removeFilter: (name: string) => void;
  ui?: any;
};

type MyImageEditorProps = {
  submenuHostId?: string;
};

const MyImageEditor = forwardRef<EditorHandle, MyImageEditorProps>(({ submenuHostId }, ref) => {
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
        menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
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

    const fitEditorToImage = () => {
      if (!editorRef.current || !instanceRef.current) return;
      const canvasSize = instanceRef.current.getCanvasSize();
      if (!canvasSize?.width || !canvasSize?.height) return;

      const hostWidth = editorRef.current.clientWidth;
      if (!hostWidth) return;

      const controlsHeight = 64;
      const minUiHeight = 180;
      const maxUiHeight = 760;
      const scale = hostWidth / canvasSize.width;
      const imageHeight = Math.round(canvasSize.height * scale);
      const nextHeight = Math.max(minUiHeight, Math.min(maxUiHeight, imageHeight + controlsHeight));

      editor.ui.resizeEditor({
        uiSize: {
          width: "100%",
          height: `${nextHeight}px`,
        },
      });
    };

    setEditorBridgeHandle({
      applyFilter: (name: string, options?: unknown) => editor.applyFilter(name as any, options as any),
      removeFilter: (name: string) => editor.removeFilter(name),
      ui: editor.ui as any,
    });

    const moveSubmenu = () => {
      if (!submenuHostId || !editorRef.current) return;
      (editor.ui as any)?.activeMenuEvent?.("filter");
      const host = document.getElementById(submenuHostId);
      const submenu = editorRef.current.querySelector(".tui-image-editor-submenu");
      if (!host || !submenu) return;

      const grayscaleInput = submenu.querySelector(".tie-grayscale");
      if (!grayscaleInput) {
        host.replaceChildren();
        window.setTimeout(() => {
          (editor.ui as any)?.activeMenuEvent?.("filter");
        }, 0);
        return;
      }

      host.replaceChildren();
      const grayscaleRow = grayscaleInput?.closest("li");
      const rowList = grayscaleRow?.parentElement;
      if (grayscaleRow && rowList) {
        let cursor = rowList.firstElementChild;
        while (cursor && cursor !== grayscaleRow) {
          const next = cursor.nextElementSibling;
          cursor.remove();
          cursor = next;
        }

        const sliderGroupA = rowList.querySelector("li .tie-removewhite-distance-range")?.closest("li");
        const sliderGroupB = rowList.querySelector("li .tie-pixelate-range")?.closest("li");
        if (
          sliderGroupA instanceof HTMLElement &&
          sliderGroupB instanceof HTMLElement &&
          sliderGroupA !== sliderGroupB
        ) {
          const movedGroups = Array.from(
            sliderGroupB.querySelectorAll(".tui-image-editor-checkbox-group")
          );
          movedGroups.forEach((group) => {
            sliderGroupA.appendChild(group);
          });
          sliderGroupB.remove();
        }

        const partitions = Array.from(rowList.querySelectorAll(".tui-image-editor-partition"));
        partitions.forEach((part) => part.remove());
      }

      host.appendChild(submenu);
    };
    moveSubmenu();
    const timer = window.setTimeout(moveSubmenu, 0);
    const fitTimer = window.setTimeout(fitEditorToImage, 0);
    let attempts = 0;
    const retryTimer = window.setInterval(() => {
      moveSubmenu();
      attempts += 1;
      if (attempts >= 30) {
        window.clearInterval(retryTimer);
      }
    }, 120);
    const observer = new MutationObserver(() => {
      moveSubmenu();
      fitEditorToImage();
    });
    observer.observe(editorRef.current, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(() => {
      fitEditorToImage();
    });
    resizeObserver.observe(editorRef.current);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(fitTimer);
      window.clearInterval(retryTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      setEditorBridgeHandle(null);
      editor.destroy();
      instanceRef.current = null;
    };
  }, [submenuHostId]);

  useImperativeHandle(ref, () => ({
    loadImage: async (file: File) => {
      if (!instanceRef.current) return;
      await instanceRef.current.loadImageFromFile(file, file.name);
      const canvasSize = instanceRef.current.getCanvasSize();
      if (editorRef.current && canvasSize?.width && canvasSize?.height) {
        const hostWidth = editorRef.current.clientWidth;
        const controlsHeight = 64;
        const minUiHeight = 180;
        const maxUiHeight = 760;
        const scale = hostWidth / canvasSize.width;
        const imageHeight = Math.round(canvasSize.height * scale);
        const nextHeight = Math.max(minUiHeight, Math.min(maxUiHeight, imageHeight + controlsHeight));
        await instanceRef.current.ui.resizeEditor({
          uiSize: { width: "100%", height: `${nextHeight}px` },
        });
      }
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
    ui: instanceRef.current?.ui,
  }));

  return <div ref={editorRef} style={{ width: "100%" }} />;
});

MyImageEditor.displayName = "MyImageEditor";

export default MyImageEditor;

type EditorBridgeHandle = {
  applyFilter: (name: string, options?: unknown) => unknown;
  removeFilter: (name: string) => unknown;
  ui?: {
    activeMenuEvent?: (menuName: string) => void;
  };
};

let handle: EditorBridgeHandle | null = null;

export function setEditorBridgeHandle(next: EditorBridgeHandle | null) {
  handle = next;
}

export function getEditorBridgeHandle() {
  return handle;
}

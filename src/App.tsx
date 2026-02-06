import { useRef } from "react";
import Chat from "./components/Chat";
import MyImageEditor from "./components/ImageEditor";

export default function App() {
  const editorRef = useRef<any>(null);

  return (
    <div style={{ height: "100vh", width:"100vw", position: "relative", overflow: "hidden" }}>
      <MyImageEditor ref={editorRef} />
      <Chat editorRef={editorRef} />
    </div>
  );
}
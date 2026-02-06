import Chat from "./components/chat";
import MyImageEditor from "./components/ImageEditor";

export default function App() {
  return (
    <div style={{ height: "100vh", width:"100vw", position: "relative", overflow: "hidden" }}>
      <MyImageEditor />
      <Chat />
    </div>
  );
}

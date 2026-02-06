import {
  useTamboThread,
  useTamboThreadInput
} from "@tambo-ai/react";

export default function Chat() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 320,
        height: 380,

        display: "flex",
        flexDirection: "column",

        background: "rgba(20,20,20,0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        overflow: "hidden",
        color: "white",
        fontSize: 13,
        zIndex: 999
      }}
    >

      <div
        style={{
          padding: "10px 12px",
          fontWeight: 600,
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        💀 AI Editor
      </div>

      <div
        style={{
          flex: 1,
          padding: 10,
          overflowY: "auto"
        }}
      >
        {thread.messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 6 }}>
            {Array.isArray(m.content)
              ? m.content.map((p, i) =>
                  p.type === "text" ? (
                    <div
                      key={i}
                      style={{
                        background: "#2a2a2a",
                        padding: "6px 8px",
                        borderRadius: 6
                      }}
                    >
                      {p.text}
                    </div>
                  ) : null
                )
              : null}

            {m.renderedComponent}
          </div>
        ))}

        {isPending && <div style={{ opacity: 0.5 }}>Thinking…</div>}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 8,
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe edit..."
          style={{
            flex: 1,
            padding: 6,
            borderRadius: 6,
            border: "none",
            outline: "none"
          }}
        />

        <button
          onClick={() => submit()}
          disabled={isPending}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            background: "#4f46e5",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

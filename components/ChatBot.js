import { useState, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Typing effect
      let i = 0;
      let botText = "";
      const interval = setInterval(() => {
        botText += data.response[i];
        setMessages((prev) => [
          ...prev.filter(m => m.sender !== "bot-temp"),
          { sender: "bot-temp", text: botText }
        ]);
        i++;
        if (i >= data.response.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map(m => m.sender === "bot-temp" ? { sender: "bot", text: m.text } : m)
          );
          setTyping(false);
        }
      }, 15);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Xatolik yuz berdi." }]);
      setTyping(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", height: "400px", overflowY: "scroll", background: "#f9f9f9" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <div style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "10px",
              background: m.sender === "user" ? "#d1e7dd" : "#e2e3e5",
              whiteSpace: "pre-line"
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && <div style={{ textAlign: "left", margin: "5px 0" }}>
          <div style={{ display: "inline-block", padding: "10px", borderRadius: "10px", background: "#e2e3e5" }}>
            Typing...
          </div>
        </div>}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          style={{ padding: "10px 15px", marginLeft: "5px", borderRadius: "5px", border: "none", background: "#0d6efd", color: "#fff" }}
          onClick={handleSend}
        >
          Yuborish
        </button>
      </div>
    </div>
  );
}

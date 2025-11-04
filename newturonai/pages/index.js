import { useState, useEffect, useRef } from "react";

export default function Home() {
  const turonInfo = {
    name: "Turon O'quv Markazi",
    description:
      "Turon o'quv markazi sifatli ta'lim va malakali o'qituvchilar bilan xizmat qiladi. Bizning maqsadimiz har bir talabaga bilim berish va ularning kelajakdagi muvaffaqiyatiga yordam berishdir.",
    courses: ["Matematika", "Ingliz tili", "Kompyuter fanlari"],
    location: "Farg‘ona shahar, TATU filiali yaqinida",
    contact: "+998 90 123 45 67",
    hours: "Dushanba - Shanba: 09:00 - 19:00"
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    // **AI-lik tahlil qiluvchi funksiyasi**
    const analyzeMessage = (msg) => {
      msg = msg.toLowerCase();

      const keywords = [
        { keys: ["nom", "ism"], answer: `🏫 Nomi: ${turonInfo.name}` },
        { keys: ["kurs", "fanlar", "yo'nalish"], answer: `🎓 Kurslar: ${turonInfo.courses.join(", ")}` },
        { keys: ["manzil", "joylashuv", "address"], answer: `📍 Manzil: ${turonInfo.location}` },
        { keys: ["aloqa", "telefon", "kontakt"], answer: `📞 Kontakt: ${turonInfo.contact}` },
        { keys: ["vaqt", "soat", "ish vaqti"], answer: `🕘 Ish vaqti: ${turonInfo.hours}` },
        { keys: ["tavsif", "haqida", "ma'lumot"], answer: `ℹ️ ${turonInfo.description}` }
      ];

      let answers = [];
      keywords.forEach((k) => {
        k.keys.forEach((key) => {
          if (msg.includes(key)) answers.push(k.answer);
        });
      });

      if (answers.length === 0) return "Uzr, men faqat Turon o'quv markazi haqida ma’lumot beraman.";
      return answers.join("\n");
    };

    const botResponse = analyzeMessage(userMessage);

    // Typing effect
    let i = 0;
    let tempText = "";
    const interval = setInterval(() => {
      tempText += botResponse[i];
      setMessages((prev) => [
        ...prev.filter((m) => m.sender !== "bot-temp"),
        { sender: "bot-temp", text: tempText }
      ]);
      i++;
      if (i >= botResponse.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) => (m.sender === "bot-temp" ? { sender: "bot", text: m.text } : m))
        );
        setTyping(false);
      }
    }, 15);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Turon O'quv Markazi ChatBot</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "15px",
          height: "500px",
          overflowY: "scroll",
          background: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "8px 0",
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "12px",
                borderRadius: "15px",
                maxWidth: "80%",
                background: m.sender === "user" ? "#d1e7dd" : "#e2e3e5",
                whiteSpace: "pre-line",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ margin: "8px 0", display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                display: "inline-block",
                padding: "12px",
                borderRadius: "15px",
                background: "#e2e3e5",
                fontStyle: "italic",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: "15px" }}>
        <input
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yozing..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          style={{
            padding: "12px 18px",
            marginLeft: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#0d6efd",
            color: "#fff",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onClick={handleSend}
        >
          Yuborish
        </button>
      </div>
    </div>
  );
}

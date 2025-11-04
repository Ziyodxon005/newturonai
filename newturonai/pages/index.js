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
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    // Tahlil qiluvchi funksiya: har qanday shakldagi savolni qamrab oladi
    const analyzeMessage = (msg) => {
      msg = msg.toLowerCase();

      let answers = [];

      const allKeywords = [
        { keys: ["nom", "ism", "markaz"], answer: `🏫 Nomi: ${turonInfo.name}` },
        { keys: ["kurs", "fan", "yo'nalish"], answer: `🎓 Kurslar: ${turonInfo.courses.join(", ")}` },
        { keys: ["manzil", "joylashuv", "address"], answer: `📍 Manzil: ${turonInfo.location}` },
        { keys: ["aloqa", "telefon", "kontakt"], answer: `📞 Kontakt: ${turonInfo.contact}` },
        { keys: ["vaqt", "soat", "ish vaqti"], answer: `🕘 Ish vaqti: ${turonInfo.hours}` },
        { keys: ["tavsif", "haqida", "ma'lumot"], answer: `ℹ️ ${turonInfo.description}` }
      ];

      allKeywords.forEach((k) => {
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
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f2f5", minHeight: "100vh", padding: "50px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#0d6efd" }}>
        Turon O'quv Markazi ChatBot
      </h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            height: "500px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                margin: "10px 0",
                display: "flex"
              }}
            >
              <div
                style={{
                  background: m.sender === "user" ? "#0d6efd" : "#e9ecef",
                  color: m.sender === "user" ? "#fff" : "#000",
                  padding: "12px 16px",
                  borderRadius: "20px",
                  maxWidth: "80%",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  whiteSpace: "pre-line"
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ alignSelf: "flex-start", margin: "10px 0" }}>
              <div
                style={{
                  background: "#e9ecef",
                  padding: "12px 16px",
                  borderRadius: "20px",
                  fontStyle: "italic",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
              >
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ display: "flex", borderTop: "1px solid #dee2e6", background: "#fff" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Savolingizni yozing..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{
              flex: 1,
              border: "none",
              padding: "15px",
              fontSize: "16px",
              outline: "none"
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              padding: "0 25px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.3s ease"
            }}
          >
            Yuborish
          </button>
        </div>
      </div>
    </div>
  );
}

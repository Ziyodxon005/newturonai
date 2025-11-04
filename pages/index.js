import { useState } from "react";

export default function Home() {
  // Turon ma'lumotlari
  const turonInfo = {
    name: "Turon o'quv markazi",
    courses: ["Matematika", "Ingliz tili", "Kompyuter fanlari"],
    location: "Farg‘ona shahar, TATU filiali yaqinida",
    contact: "+998 90 123 45 67",
    description: "Turon o'quv markazi sifatli ta'lim va malakali o'qituvchilar bilan xizmat qiladi."
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // ChatBot logikasi
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setTyping(true);

    // Javobni "typing effect" bilan chiqarish
    let botResponse = "";
    if (/turon|o'quv markaz/i.test(userMessage)) {
      botResponse = `📚 Bizning o'quv markazimiz haqida ma'lumot:\n\n` +
                    `🏫 Nomi: ${turonInfo.name}\n` +
                    `🎓 Kurslar: ${turonInfo.courses.join(", ")}\n` +
                    `📍 Manzil: ${turonInfo.location}\n` +
                    `📞 Kontakt: ${turonInfo.contact}\n\n` +
                    `ℹ️ ${turonInfo.description}`;
    } else {
      botResponse = "Uzr, men faqat o'quv markaz haqida ma’lumot beraman.";
    }

    let i = 0;
    let tempText = "";
    const interval = setInterval(() => {
      tempText += botResponse[i];
      setMessages((prev) => [
        ...prev.filter(m => m.sender !== "bot-temp"),
        { sender: "bot-temp", text: tempText }
      ]);
      i++;
      if (i >= botResponse.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map(m => m.sender === "bot-temp" ? { sender: "bot", text: m.text } : m)
        );
        setTyping(false);
      }
    }, 15);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Turon O'quv Markazi ChatBot</h1>
      
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
        {typing && (
          <div style={{ textAlign: "left", margin: "5px 0" }}>
            <div style={{ display: "inline-block", padding: "10px", borderRadius: "10px", background: "#e2e3e5" }}>
              Typing...
            </div>
          </div>
        )}
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

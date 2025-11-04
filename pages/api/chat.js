import turonInfo from "../../data/turon.json";

export default function handler(req, res) {
  const { message } = req.body;

  let response = "";

  if (/turon|o'quv markaz/i.test(message)) {
    response = `📚 Bizning o'quv markazimiz haqida ma'lumot:\n\n` +
               `🏫 Nomi: ${turonInfo.name}\n` +
               `🎓 Kurslar: ${turonInfo.courses.join(", ")}\n` +
               `📍 Manzil: ${turonInfo.location}\n` +
               `📞 Kontakt: ${turonInfo.contact}\n\n` +
               `ℹ️ ${turonInfo.description}`;
  } else {
    response = "Uzr, men faqat o'quv markaz haqida ma’lumot beraman.";
  }

  res.status(200).json({ response });
}

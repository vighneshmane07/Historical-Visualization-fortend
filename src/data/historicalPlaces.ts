export interface HistoricalPlace {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  location: string;
  locationHi: string;
  locationMr: string;
  era: string;
  emoji: string;
  category: "india" | "world";
}

export const historicalPlaces: HistoricalPlace[] = [
  // India
  { id: "taj-mahal", name: "Taj Mahal", nameHi: "ताज महल", nameMr: "ताज महाल", location: "Agra, Uttar Pradesh", locationHi: "आगरा, उत्तर प्रदेश", locationMr: "आग्रा, उत्तर प्रदेश", era: "1632–1653", emoji: "🕌", category: "india" },
  { id: "red-fort", name: "Red Fort", nameHi: "लाल किला", nameMr: "लाल किल्ला", location: "Delhi", locationHi: "दिल्ली", locationMr: "दिल्ली", era: "1638–1648", emoji: "🏰", category: "india" },
  { id: "qutub-minar", name: "Qutub Minar", nameHi: "कुतुब मीनार", nameMr: "कुतुब मिनार", location: "Delhi", locationHi: "दिल्ली", locationMr: "दिल्ली", era: "1199–1220", emoji: "🗼", category: "india" },
  { id: "hawa-mahal", name: "Hawa Mahal", nameHi: "हवा महल", nameMr: "हवा महाल", location: "Jaipur, Rajasthan", locationHi: "जयपुर, राजस्थान", locationMr: "जयपूर, राजस्थान", era: "1799", emoji: "🏛️", category: "india" },
  { id: "hampi", name: "Hampi Ruins", nameHi: "हम्पी के खंडहर", nameMr: "हंपीचे अवशेष", location: "Karnataka", locationHi: "कर्नाटक", locationMr: "कर्नाटक", era: "14th–16th Century", emoji: "🏚️", category: "india" },
  { id: "konark", name: "Konark Sun Temple", nameHi: "कोणार्क सूर्य मंदिर", nameMr: "कोणार्क सूर्य मंदिर", location: "Odisha", locationHi: "ओडिशा", locationMr: "ओडिशा", era: "13th Century", emoji: "☀️", category: "india" },
  { id: "ajanta-ellora", name: "Ajanta & Ellora Caves", nameHi: "अजंता और एलोरा गुफाएं", nameMr: "अजिंठा आणि वेरूळ लेणी", location: "Maharashtra", locationHi: "महाराष्ट्र", locationMr: "महाराष्ट्र", era: "2nd Century BCE–6th Century CE", emoji: "🕳️", category: "india" },
  { id: "gateway-india", name: "Gateway of India", nameHi: "गेटवे ऑफ इंडिया", nameMr: "गेटवे ऑफ इंडिया", location: "Mumbai, Maharashtra", locationHi: "मुंबई, महाराष्ट्र", locationMr: "मुंबई, महाराष्ट्र", era: "1924", emoji: "🚪", category: "india" },
  { id: "mysore-palace", name: "Mysore Palace", nameHi: "मैसूर पैलेस", nameMr: "म्हैसूर पॅलेस", location: "Karnataka", locationHi: "कर्नाटक", locationMr: "कर्नाटक", era: "1912", emoji: "👑", category: "india" },
  { id: "golden-temple", name: "Golden Temple", nameHi: "स्वर्ण मंदिर", nameMr: "सुवर्ण मंदिर", location: "Amritsar, Punjab", locationHi: "अमृतसर, पंजाब", locationMr: "अमृतसर, पंजाब", era: "1604", emoji: "✨", category: "india" },
  { id: "charminar", name: "Charminar", nameHi: "चारमीनार", nameMr: "चारमिनार", location: "Hyderabad, Telangana", locationHi: "हैदराबाद, तेलंगाना", locationMr: "हैदराबाद, तेलंगणा", era: "1591", emoji: "🕌", category: "india" },
  { id: "raigad-fort", name: "Raigad Fort", nameHi: "रायगढ़ किला", nameMr: "रायगड किल्ला", location: "Maharashtra", locationHi: "महाराष्ट्र", locationMr: "महाराष्ट्र", era: "1674", emoji: "⚔️", category: "india" },
  // World
  { id: "colosseum", name: "Colosseum", nameHi: "कोलोसियम", nameMr: "कोलोसियम", location: "Rome, Italy", locationHi: "रोम, इटली", locationMr: "रोम, इटली", era: "70–80 AD", emoji: "🏟️", category: "world" },
  { id: "great-wall", name: "Great Wall of China", nameHi: "चीन की महान दीवार", nameMr: "चीनची भिंत", location: "China", locationHi: "चीन", locationMr: "चीन", era: "7th Century BCE", emoji: "🧱", category: "world" },
  { id: "machu-picchu", name: "Machu Picchu", nameHi: "माचू पिचू", nameMr: "माचू पिचू", location: "Peru", locationHi: "पेरू", locationMr: "पेरू", era: "15th Century", emoji: "⛰️", category: "world" },
  { id: "pyramids", name: "Pyramids of Giza", nameHi: "गीज़ा के पिरामिड", nameMr: "गिझाचे पिरॅमिड", location: "Egypt", locationHi: "मिस्र", locationMr: "इजिप्त", era: "2580–2560 BCE", emoji: "🔺", category: "world" },
  { id: "petra", name: "Petra", nameHi: "पेट्रा", nameMr: "पेट्रा", location: "Jordan", locationHi: "जॉर्डन", locationMr: "जॉर्डन", era: "4th Century BCE", emoji: "🏜️", category: "world" },
  { id: "angkor-wat", name: "Angkor Wat", nameHi: "अंगकोर वाट", nameMr: "अंगकोर वाट", location: "Cambodia", locationHi: "कंबोडिया", locationMr: "कंबोडिया", era: "12th Century", emoji: "🛕", category: "world" },
];

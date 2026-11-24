/** Public facts about YMR, as published on ymrglobal.org and the 2026 flyer. */

export const SITE = {
  name: "YMR Counselling",
  program: "Young Ministers Retreat",
  theme: "City Takers",
  subtitle: "YMR Global Revival 2026",
  dates: "December 26 – 30, 2026",
  datesShort: "Dec 26 – 30",
  venue: "Old Auditorium, Redemption City of God",
  address: "KM 46, Lagos–Ibadan Expressway, Ogun State, Nigeria",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Old+Auditorium+Redemption+City+of+God+Ogun+State+Nigeria",
  registerUrl: "https://register.ymrglobal.org/",
  mainSite: "https://ymrglobal.org/",
  email: "info@ymrglobal.org",
  phones: ["+234 704 878 2063", "+44 7881 155846"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/ymrglobal/" },
    { label: "YouTube", href: "https://www.youtube.com/@PDanielOlawande" },
    { label: "Facebook", href: "https://www.facebook.com/ymrglobal" },
    { label: "X", href: "https://x.com/ymrglobal" },
    { label: "TikTok", href: "https://www.tiktok.com/@ymrglobal" },
    { label: "Telegram", href: "https://t.me/pdanielfireinmybones" },
  ],
  stats: [
    { value: 2017, label: "Year the fire started", suffix: "" },
    { value: 20, label: "Souls saved", suffix: "K+" },
    { value: 7, label: "Nations reached", suffix: "+" },
    { value: 10, label: "Editions of revival", suffix: "" },
  ],
};

export interface Minister {
  slug: string;
  title: string;
  name: string;
  role?: string;
}

export const MINISTERS: Minister[] = [
  { slug: "ea-adeboye", title: "Pst.", name: "E. A. Adeboye" },
  { slug: "folu-adeboye", title: "Pst.", name: "Folu Adeboye" },
  { slug: "daniel-olawande", title: "P.", name: "Daniel Olawande", role: "Convener" },
  { slug: "nifemi-olawande", title: "Pst.", name: "Nifemi Olawande" },
  { slug: "samson-ajetomobi", title: "Rev.", name: "Samson Ajetomobi" },
  { slug: "paul-enenche", title: "Pst.", name: "Paul Enenche" },
  { slug: "shola-olukoya", title: "Pst.", name: "Shola Olukoya" },
  { slug: "poju-oyemade", title: "Pst.", name: "Poju Oyemade" },
  { slug: "jonathan-shuttlesworth", title: "Rev.", name: "Jonathan Shuttlesworth" },
  { slug: "leke-adeboye", title: "Pst.", name: "Leke Adeboye" },
  { slug: "mike-orokpo", title: "Apst.", name: "Mike Orokpo" },
  { slug: "nathaniel-bassey", title: "Pst.", name: "Nathaniel Bassey" },
  { slug: "dunsin-oyekan", title: "Min.", name: "Dunsin Oyekan" },
  { slug: "preacher-jay", title: "", name: "Preacher Jay" },
  { slug: "randolph-adjei", title: "Pst.", name: "Randolph Adjei" },
  { slug: "femi-oyewunmi", title: "Pst.", name: "Femi Oyewunmi" },
  { slug: "tee-worship", title: "Min.", name: "Tee Worship" },
  { slug: "abbey-ojomu", title: "Min.", name: "Abbey Ojomu" },
  { slug: "bbo", title: "Min.", name: "BBO" },
  { slug: "precious-worship", title: "Min.", name: "Precious Worship" },
];

export const COUNSELLING_TOPICS = [
  "Spiritual growth",
  "Relationships & marriage",
  "Career & purpose",
  "Mental & emotional health",
  "Family",
  "Finances",
  "Academics",
  "Addiction & habits",
  "Ministry & calling",
  "Grief & loss",
] as const;

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

export const COUNTRIES = ["Nigeria", "Ghana", "United Kingdom", "United States", "Canada", "South Africa", "Kenya", "Other"];

export const AGE_GROUPS = ["Under 18", "18-24", "25-30", "31-35", "36-45", "46+"] as const;

export const DENOMINATIONS = [
  "RCCG", "Catholic", "Anglican", "Methodist", "Baptist", "Winners (Living Faith)", "Deeper Life",
  "Christ Embassy", "Foursquare", "CAC", "Daystar", "COZA", "Harvesters", "Other", "None",
];

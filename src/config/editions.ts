import type { Edition } from "@/types";

/**
 * Every YMR edition. Add one entry per year; the portal's edition switcher,
 * the landing-page timeline and year-over-year analytics all read from here.
 * `hasData` marks the years whose records live in the portal database.
 */
export const EDITIONS: Edition[] = [
  { year: 2017, number: 1, theme: "Fire for Needed Impact", flyer: "/editions/ymr-2017-fire-needed-impact.jpg", start: "2017-12-26", end: "2017-12-30", venue: "Redemption City", hasData: false },
  { year: 2018, number: 2, theme: "Explosive Exploits", flyer: "/editions/ymr-2018-explosive-exploits.jpeg", start: "2018-12-26", end: "2018-12-30", venue: "Redemption City", hasData: false },
  { year: 2019, number: 3, theme: "Fire to Take the City", flyer: "/editions/ymr-2019-fire-to-take-the-city.jpeg", start: "2019-12-26", end: "2019-12-30", venue: "Redemption City", hasData: false },
  { year: 2020, number: 4, theme: "Go in This Thy Might", flyer: "/editions/ymr-2020-go-in-this-thy-might.jpeg", start: "2020-12-26", end: "2020-12-30", venue: "Redemption City", hasData: false },
  { year: 2021, number: 5, theme: "Weapons of War", flyer: "/editions/ymr-2021-weapons-of-war.jpeg", start: "2021-12-26", end: "2021-12-30", venue: "Redemption City", hasData: false },
  { year: 2022, number: 6, theme: "Witnesses", flyer: "/editions/ymr-2022-witnesses.jpeg", start: "2022-12-26", end: "2022-12-30", venue: "Redemption City", hasData: false },
  { year: 2023, number: 7, theme: "The Rain", flyer: "/editions/ymr-2023-the-rain.jpeg", start: "2023-12-26", end: "2023-12-30", venue: "Redemption City", hasData: false },
  { year: 2024, number: 8, theme: "Floodgates", flyer: "/editions/ymr-2024-flood-gates.jpeg", start: "2024-12-26", end: "2024-12-30", venue: "Redemption City", hasData: true },
  { year: 2025, number: 9, theme: "The New Army", flyer: "/editions/ymr-2025-the-new-army.jpeg", start: "2025-12-26", end: "2025-12-30", venue: "Redemption City", hasData: true },
  { year: 2026, number: 10, theme: "City Takers", flyer: "/brand/ymr-2026-city-takers-flyer.jpg", start: "2026-12-26", end: "2026-12-30", venue: "Old Auditorium, Redemption City of God", hasData: true },
];

export const CURRENT_YEAR = 2026;
export const CURRENT_EDITION = EDITIONS.find((e) => e.year === CURRENT_YEAR)!;
export const DATA_EDITIONS = EDITIONS.filter((e) => e.hasData).sort((a, b) => b.year - a.year);

export const editionByYear = (year: number) => EDITIONS.find((e) => e.year === year);

/** Event start in West Africa Time (UTC+1). */
export const EVENT_START = new Date("2026-12-26T09:00:00+01:00");
export const EVENT_END = new Date("2026-12-30T23:59:00+01:00");

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

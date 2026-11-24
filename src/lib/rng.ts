/** Small seeded PRNG (mulberry32) so mock data is identical on every load. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)]!;
  const chance = (p: number) => next() < p;
  /** Pick with weights: [[value, weight], ...] */
  const weighted = <T,>(pairs: readonly (readonly [T, number])[]) => {
    const total = pairs.reduce((s, [, w]) => s + w, 0);
    let r = next() * total;
    for (const [v, w] of pairs) {
      r -= w;
      if (r <= 0) return v;
    }
    return pairs[pairs.length - 1]![0];
  };
  const id = (len = 8) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars[Math.floor(next() * chars.length)];
    return s;
  };
  return { next, int, pick, chance, weighted, id };
}
export type Rng = ReturnType<typeof createRng>;

export const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;

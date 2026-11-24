import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CURRENT_YEAR, DATA_EDITIONS, editionByYear } from "@/config/editions";
import type { Edition } from "@/types";

interface EditionValue {
  year: number;
  edition: Edition;
  setYear: (y: number) => void;
  isCurrent: boolean;
  editions: Edition[];
}

const Ctx = createContext<EditionValue | null>(null);
const KEY = "ymr-edition";

export function EditionProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<number>(() => {
    try {
      const fromUrl = Number(new URLSearchParams(window.location.search).get("edition"));
      if (DATA_EDITIONS.some((e) => e.year === fromUrl)) return fromUrl;
      const saved = Number(localStorage.getItem(KEY));
      if (DATA_EDITIONS.some((e) => e.year === saved)) return saved;
    } catch {
      /* ignore */
    }
    return CURRENT_YEAR;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, String(year));
    } catch {
      /* ignore */
    }
  }, [year]);

  const value = useMemo(
    () => ({ year, setYear, edition: editionByYear(year)!, isCurrent: year === CURRENT_YEAR, editions: DATA_EDITIONS }),
    [year],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEdition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEdition must be used inside <EditionProvider>");
  return ctx;
}

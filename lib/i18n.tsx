"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "es" | "en";
type Dict = Record<string, { es: string; en: string }>;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: "es", setLang: () => {}, t: (k) => k });

export function LangProvider({ dict, children }: { dict: Dict; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const t = (key: string) => dict[key]?.[lang] ?? key;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

"use client";
import { useLang } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex border border-line/10 rounded-full overflow-hidden font-mono text-xs">
      <button
        onClick={() => setLang("es")}
        className={`px-3 py-1.5 ${lang === "es" ? "bg-gold text-ink font-semibold" : "text-muted"}`}
      >
        ES
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 ${lang === "en" ? "bg-gold text-ink font-semibold" : "text-muted"}`}
      >
        EN
      </button>
    </div>
  );
}

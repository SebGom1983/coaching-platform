"use client";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";

const homework = [
  { title: "Present Perfect", status: "done", note: "10 ejercicios basados en tus errores comunes." },
  { title: "Vocabulario de viajes", status: "pending", note: "Flashcards + 5 frases nuevas." },
  { title: "Pronunciación", status: "pending", note: "Grabación — sonidos 'th' y 'v'." },
  { title: "Mini quiz", status: "pending", note: "8 preguntas de repaso." },
];

const progress = [
  ["Gramática", 82],
  ["Escucha", 71],
  ["Habla", 58],
  ["Vocabulario", 90],
  ["Escritura", 67],
];

export default function Portal() {
  const { t } = useLang();

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-white/10 p-6 flex flex-col">
        <div className="font-serif font-semibold mb-10">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <nav className="flex flex-col gap-1 flex-1 text-sm">
          <a className="px-3 py-2.5 rounded-lg bg-gold/10 text-gold font-medium">Panel</a>
          <a className="px-3 py-2.5 rounded-lg text-chalkDim">Mis clases</a>
          <a className="px-3 py-2.5 rounded-lg text-chalkDim">Tarea</a>
          <a className="px-3 py-2.5 rounded-lg text-chalkDim">Progreso</a>
          <a className="px-3 py-2.5 rounded-lg text-chalkDim">Pagos</a>
        </nav>
        <LangToggle />
      </aside>

      <main className="p-10 max-w-3xl">
        <div className="flex justify-between items-start mb-9">
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
              {t("welcomeBack")}
            </span>
            <h1 className="font-serif text-3xl">
              Hola, Camila <span className="text-gold">👋</span>
            </h1>
          </div>
          <a href="#" className="bg-gold text-ink text-sm font-medium px-5 py-2.5 rounded-lg">
            {t("bookLesson")}
          </a>
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 mb-5">
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
              NEXT LESSON
            </span>
            <h3 className="font-serif text-xl mt-4 mb-1">Business English — Meetings</h3>
            <div className="text-chalkDim text-sm">
              Thursday, July 18 · <strong className="text-chalk">4:00 PM</strong>
            </div>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
              PACKAGE
            </span>
            <div className="font-mono text-2xl text-gold mt-3">
              6<span className="text-base text-muted"> / 10 lessons</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden my-3">
              <div className="h-full bg-gold" style={{ width: "60%" }} />
            </div>
          </div>
        </div>

        <h2 className="font-serif text-lg mt-9 mb-4">{t("homework")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {homework.map((h) => (
            <div key={h.title} className="bg-card border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-serif">{h.title}</h4>
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-full ${
                    h.status === "done" ? "bg-sage/20 text-sageSoft" : "bg-gold/15 text-gold"
                  }`}
                >
                  {h.status === "done" ? "DONE" : "PENDING"}
                </span>
              </div>
              <p className="text-chalkDim text-sm">{h.note}</p>
            </div>
          ))}
        </div>

        <h2 className="font-serif text-lg mt-9 mb-4">{t("progress")}</h2>
        <div className="bg-card border border-white/10 rounded-2xl p-6 grid md:grid-cols-2 gap-x-8 gap-y-3">
          {progress.map(([label, pct]) => (
            <div key={label as string} className="flex items-center gap-3">
              <span className="text-sm text-chalkDim w-24 shrink-0">{label}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-sageSoft" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-mono text-xs text-chalkDim w-9 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

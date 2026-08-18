"use client";
import { useLang } from "@/lib/i18n";
import LangToggle from "./components/LangToggle";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      <header className="sticky top-0 z-50 bg-ink/85 backdrop-blur border-b border-white/10">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-7 py-5">
          <div className="font-serif font-semibold">
            Seb<span className="text-gold">.</span> English Coaching
          </div>
          <div className="hidden md:flex gap-8 text-sm text-chalkDim">
            <a href="#method">{t("navMethod")}</a>
            <a href="#pricing">{t("navPricing")}</a>
          </div>
          <div className="flex items-center gap-4">
            <LangToggle />
            <a href="/login" className="text-sm text-chalkDim hover:text-chalk">
              {t("login")}
            </a>
            <a href="/login" className="bg-gold text-ink text-sm font-medium px-5 py-2.5 rounded-lg">
              {t("bookLesson")}
            </a>
          </div>
        </nav>
      </header>

      <section className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-5">
              {t("eyebrowExperience")}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">{t("heroTitle")}</h1>
            <p className="text-chalkDim max-w-md mb-9">{t("heroLead")}</p>
            <div className="flex gap-4">
              <a href="/login" className="bg-gold text-ink text-sm font-medium px-5 py-2.5 rounded-lg">
                {t("ctaPlacement")}
              </a>
              <a href="#method" className="border border-white/10 text-sm font-medium px-5 py-2.5 rounded-lg">
                {t("ctaMethod")}
              </a>
            </div>
          </div>

          <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
                AI-GENERATED
              </span>
              <span className="font-mono text-xs text-muted">LESSON 08</span>
            </div>
            {[
              ["Vocabulario de viajes / Travel vocabulary", "90%"],
              ["Present Perfect", "74%"],
              ["Pronunciación / Pronunciation", "58%"],
              ["Listening", "82%"],
            ].map(([label, pct]) => (
              <div key={label} className="flex justify-between text-sm text-chalkDim py-2 border-t border-white/10 first:border-t-0">
                <span>{label}</span>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden self-center">
                  <div className="h-full bg-sageSoft" style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("philosophyEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("philosophyTitle")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-ink p-10">
              <h3 className="font-serif text-xl text-gold mb-3">{t("myRole")}</h3>
              <p className="text-chalkDim text-sm">
                Coach, mentor, tutor y profesor — te acompaño en todo tu proceso de aprendizaje.
              </p>
            </div>
            <div className="bg-ink p-10">
              <h3 className="font-serif text-xl text-sageSoft mb-3">{t("aiRole")}</h3>
              <p className="text-chalkDim text-sm">
                Mi asistente de enseñanza. Nunca me reemplaza — trabaja en segundo plano.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("pricingEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("pricingTitle")}</h2>
          </div>

          {/* Intro block: rate-by-frequency explanation + payment terms */}
          <div className="bg-card border border-white/10 rounded-2xl p-8 mb-12 max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl mb-3">🚀 Tu inglés, sin excusas</h3>
            <p className="text-chalkDim text-sm mb-6 max-w-xl mx-auto">
              La constancia es la clave. Con al menos 3 clases por semana, tu inglés deja de ser
              teoría y se convierte en práctica real. Entre más clases tomes, menos pagas por sesión:
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-ink border border-white/10 rounded-xl p-4">
                <div className="font-mono text-xl text-gold mb-1">$60.000</div>
                <div className="text-chalkDim text-xs">2–3 clases/semana · por hora</div>
              </div>
              <div className="bg-ink border border-white/10 rounded-xl p-4">
                <div className="font-mono text-xl text-gold mb-1">$55.000</div>
                <div className="text-chalkDim text-xs">4 clases/semana · por hora</div>
              </div>
              <div className="bg-ink border border-white/10 rounded-xl p-4">
                <div className="font-mono text-xl text-gold mb-1">$50.000</div>
                <div className="text-chalkDim text-xs">5 clases/semana · por hora</div>
              </div>
            </div>
            <p className="text-chalkDim text-xs">📅 Todos los cursos son de mínimo 1 mes (4 semanas).</p>
            <p className="text-chalkDim text-xs">
              💳 El pago se realiza en dos partes: 50% al inicio y 50% al llegar a la mitad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Starter",
                lessons: 12,
                tagline: "Empieza hoy, habla con confianza mañana.",
                description:
                  "12 sesiones de una hora para construir bases sólidas y ganar seguridad al hablar.",
                featured: false,
              },
              {
                name: "Coaching",
                lessons: 16,
                tagline: "Constancia que se convierte en fluidez.",
                description:
                  "16 sesiones de una hora con práctica constante, feedback personalizado y progreso semana a semana.",
                featured: true,
              },
              {
                name: "Immersion",
                lessons: 20,
                tagline: "Inglés todos los días, resultados reales.",
                description:
                  "20 sesiones de una hora para transformar la fluidez, pensar en inglés y expresarse con naturalidad.",
                featured: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`bg-card border rounded-2xl p-8 flex flex-col ${
                  p.featured ? "border-gold" : "border-white/10"
                }`}
              >
                <h4 className="font-serif text-xl mb-1">{p.name}</h4>
                <div className="font-mono text-2xl text-gold my-3">{p.lessons} clases/mes</div>
                <p className="text-chalkDim text-sm mb-6">{p.description}</p>
                <a
                  href="/login"
                  className={`text-sm font-medium px-5 py-2.5 rounded-lg text-center ${
                    p.featured ? "bg-gold text-ink" : "border border-white/10"
                  }`}
                >
                  {t("bookLesson")}
                </a>
                <p className="text-chalkDim text-xs text-center mt-3 italic">{p.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <footer className="py-12 text-center text-muted text-sm">
        Seb<span className="text-gold">.</span> English Coaching — © 2026 Bogotá, Colombia
      </footer>
    </>
  );
}

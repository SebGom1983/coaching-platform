"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import LangToggle from "./components/LangToggle";
import { getSiteAbout, getClassVideos, SiteAbout, ClassVideo } from "@/lib/firebase";

// Add real testimonials here once you have them.
const TESTIMONIALS: { name: string; quote: string; role?: string }[] = [
  // { name: "María P.", role: "Gerente de proyectos", quote: "..." },
];

// Company badges shown as text for now — swap in real logo images (imgur
// links) the same way you add material thumbnails, whenever you have them.
const COMPANIES = [
  "DHL",
  "Berlitz",
  "Banco Interamericano de Desarrollo",
  "Lufthansa",
  "Celebrity Cruises",
  "CAF",
  "Linked SAS",
  "E3 English",
  "HTL Idiomas",
  "Netactica",
];

export default function Home() {
  const { t, lang } = useLang();
  const [about, setAbout] = useState<SiteAbout | null>(null);
  const [videos, setVideos] = useState<ClassVideo[]>([]);

  useEffect(() => {
    getSiteAbout().then(setAbout);
    getClassVideos().then(setVideos);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ink/85 backdrop-blur border-b border-white/10">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-7 py-5">
          <div className="font-serif font-semibold">
            Seb<span className="text-gold">.</span> English Coaching
          </div>
          <div className="hidden md:flex gap-8 text-sm text-chalkDim">
            <a href="#about">{t("navAbout")}</a>
            <a href="#method">{t("navMethod")}</a>
            <a href="#classes">{t("navClasses")}</a>
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

      {/* Hero */}
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

          <div>
            {about?.heroPhotoUrl ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.heroPhotoUrl}
                  alt="Seb"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-white/10 py-28">
        <div className="bg-card border border-white/10 rounded-2xl aspect-square overflow-hidden">
        <img src="https://i.imgur.com/noVJ3jb.jpeg"alt="Profile"className="w-full h-full object-cover"/>
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("aboutEyebrow")}
            </span>
            <h2 className="font-serif text-3xl mb-5">{about ? (lang === "es" ? about.titleEs : about.titleEn) : ""}</h2>
            <p className="text-chalkDim text-sm mb-4 leading-relaxed">
              {about ? (lang === "es" ? about.body1Es : about.body1En) : ""}
            </p>
            <p className="text-chalkDim text-sm mb-4 leading-relaxed">
              {about ? (lang === "es" ? about.body2Es : about.body2En) : ""}
            </p>
            <div className="flex gap-5">
              {about?.instagramUrl && (
                <a
                  href={about.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm font-medium hover:underline"
                >
                  Instagram ↗
                </a>
              )}
              {about?.linkedinUrl && (
                <a
                  href={about.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm font-medium hover:underline"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="border-b border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-7">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted mb-8">
            {t("companiesEyebrow")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="font-serif text-sm text-chalkDim border border-white/10 rounded-full px-4 py-2"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Method / philosophy */}
      <section id="method" className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("philosophyEyebrow")}
            </span>
            <h2 className="font-serif text-3xl mb-4">{t("philosophyTitle")}</h2>
            <p className="text-chalkDim text-sm">{t("philosophyLead")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { emoji: "💬", title: t("pillar1Title"), body: t("pillar1Body") },
              { emoji: "🎯", title: t("pillar2Title"), body: t("pillar2Body") },
              { emoji: "🤖", title: t("pillar3Title"), body: t("pillar3Body") },
            ].map((p) => (
              <div key={p.title} className="bg-card border border-white/10 rounded-2xl p-8">
                <div className="text-2xl mb-3">{p.emoji}</div>
                <h3 className="font-serif text-lg mb-2">{p.title}</h3>
                <p className="text-chalkDim text-sm">{p.body}</p>
              </div>
            ))}
          </div>

          <p className="text-center font-serif text-xl text-gold max-w-xl mx-auto">{t("keyPhrase")}</p>
        </div>
      </section>

      {/* Real class videos */}
      <section id="classes" className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("classesEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("classesVideoTitle")}</h2>
          </div>

          {videos.length === 0 ? (
            <div className="bg-card border border-white/10 rounded-2xl p-16 text-center text-chalkDim text-sm max-w-xl mx-auto">
              {t("classesComingSoon")}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((v) => (
                <div key={v.id} className="rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={lang === "es" ? v.titleEs : v.titleEn}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-chalkDim text-sm p-4">{lang === "es" ? v.titleEs : v.titleEn}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("testimonialsEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("testimonialsTitle")}</h2>
          </div>

          {TESTIMONIALS.length === 0 ? (
            <div className="bg-card border border-white/10 rounded-2xl p-16 text-center text-chalkDim text-sm max-w-xl mx-auto">
              {t("testimonialsComingSoon")}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((tst) => (
                <div key={tst.name} className="bg-card border border-white/10 rounded-2xl p-6">
                  <p className="text-chalkDim text-sm mb-4 italic">&ldquo;{tst.quote}&rdquo;</p>
                  <p className="font-serif text-sm">{tst.name}</p>
                  {tst.role && <p className="text-muted text-xs">{tst.role}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("servicesEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("servicesTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              t("service1"),
              t("service2"),
              t("service3"),
              t("service4"),
              t("service5"),
            ].map((s) => (
              <div key={s} className="bg-card border border-white/10 rounded-xl p-5 text-sm">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-white/10 py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-3">
              {t("pricingEyebrow")}
            </span>
            <h2 className="font-serif text-3xl">{t("pricingTitle")}</h2>
          </div>

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

      {/* Final CTA */}
      <section className="py-28">
        <div className="max-w-2xl mx-auto px-7 text-center">
          <h2 className="font-serif text-3xl mb-4">{t("finalCtaTitle")}</h2>
          <p className="text-chalkDim text-sm mb-8">{t("finalCtaBody")}</p>
          <a href="/login" className="bg-gold text-ink text-sm font-medium px-6 py-3 rounded-lg inline-block">
            {t("bookLesson")}
          </a>
        </div>
      </section>

      <footer className="py-12 text-center text-muted text-sm">
        Seb<span className="text-gold">.</span> English Coaching — © 2026 Bogotá, Colombia
        {about?.instagramUrl && (
          <>
            <span className="mx-2">·</span>
            <a href={about.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-chalkDim">
              Instagram
            </a>
          </>
        )}
        {about?.linkedinUrl && (
          <>
            <span className="mx-2">·</span>
            <a href={about.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-chalkDim">
              LinkedIn
            </a>
          </>
        )}
      </footer>
    </>
  );
}

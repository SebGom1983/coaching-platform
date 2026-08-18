"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { auth, getStudentMaterials, setMaterialStatus, getStudentClasses, Material, ClassSession } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";
import MaterialCard from "../components/MaterialCard";

export default function Portal() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch this student's own material from Firestore
  useEffect(() => {
    if (user) {
      Promise.all([getStudentMaterials(user.uid), getStudentClasses(user.uid)]).then(([m, c]) => {
        setMaterials(m);
        setClasses(c);
        setLoadingData(false);
      });
    }
  }, [user]);

  const upcomingClasses = classes.filter((c) => new Date(c.startsAt).getTime() >= Date.now());
  const calendarUrl = user
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/api/calendar/${user.uid}`
    : "";

  function copyCalendarLink() {
    navigator.clipboard.writeText(calendarUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function toggleHomework(m: Material) {
    const next = m.status === "done" ? "pending" : "done";
    await setMaterialStatus(m.id, next);
    setMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)));
  }

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">{t("loading")}</div>;
  }

  if (loadingData) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">{t("loadingData")}</div>;
  }

  const homework = materials.filter((m) => m.type === "homework");
  const resources = materials.filter((m) => m.type !== "homework");

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-white/10 p-6 flex flex-col">
        <div className="font-serif font-semibold mb-10">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <nav className="flex flex-col gap-1 flex-1 text-sm">
          <a className="px-3 py-2.5 rounded-lg bg-gold/10 text-gold font-medium">{t("panel")}</a>
        </nav>
        <button
          onClick={() => signOut(auth)}
          className="text-left text-xs text-muted px-3 py-2 mb-2"
        >
          {t("logout")}
        </button>
        <LangToggle />
      </aside>

      <main className="p-10 max-w-3xl">
        <div className="flex justify-between items-start mb-9">
          <div>
            <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
              {t("welcomeBack")}
            </span>
            <h1 className="font-serif text-3xl">
              {t("greeting")} {profile?.name || ""} <span className="text-gold">👋</span>
            </h1>
          </div>
        </div>

        <h2 className="font-serif text-lg mb-4">Próximas clases</h2>
        {upcomingClasses.length === 0 ? (
          <p className="text-chalkDim text-sm mb-9">Todavía no tienes clases agendadas.</p>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {upcomingClasses.map((c) => {
              const d = new Date(c.startsAt);
              const dateLabel = d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
              const timeLabel = d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={c.id} className="bg-card border border-white/10 rounded-xl p-5 flex justify-between items-center gap-4">
                  <div>
                    <p className="font-serif capitalize">{dateLabel} — {timeLabel}</p>
                    <p className="text-chalkDim text-sm">{c.durationMinutes} min</p>
                  </div>
                  {c.teamsLink && (
                    <a
                      href={c.teamsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold text-ink text-sm font-medium px-4 py-2 rounded-lg shrink-0"
                    >
                      Unirse
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-card border border-white/10 rounded-xl p-5 mb-9">
          <p className="text-sm mb-2">📅 Sincroniza tus clases con tu calendario</p>
          <p className="text-chalkDim text-xs mb-3">
            Agrega este link una sola vez a Google Calendar, Apple Calendar u Outlook — tus clases
            nuevas van a aparecer ahí solas, sin que tengas que hacer nada más.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={calendarUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-ink border border-white/10 rounded-lg px-3 py-2 text-xs text-chalkDim outline-none"
            />
            <button
              onClick={copyCalendarLink}
              className="bg-gold/15 text-gold text-xs font-medium px-3 py-2 rounded-lg shrink-0"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="bg-card border border-white/10 rounded-xl p-5 mb-9">
          <p className="text-sm mb-3">💳 Cómo pagar (Bre-B)</p>
          <p className="text-chalkDim text-xs mb-4">
            Transfiere directo desde tu app del banco usando Bre-B — busca "Bre-B" o "Llaves" y paga
            a cualquiera de estas dos llaves. Después de pagar, envíame el comprobante por WhatsApp.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { bank: "Bancolombia", key: "80815929", preferred: true },
              { bank: "Nu", key: "@ZAZ929", preferred: false },
            ].map((opt) => (
              <div
                key={opt.bank}
                className="flex items-center justify-between gap-3 bg-ink border border-white/10 rounded-lg px-3 py-2.5"
              >
                <div>
                  <span className="text-sm font-medium">{opt.bank}</span>
                  {opt.preferred && (
                    <span className="ml-2 font-mono text-[10px] text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                      PREFERIDA
                    </span>
                  )}
                  <p className="font-mono text-xs text-chalkDim">{opt.key}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(opt.key);
                    setCopiedKey(opt.bank);
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="bg-gold/15 text-gold text-xs font-medium px-3 py-1.5 rounded-lg shrink-0"
                >
                  {copiedKey === opt.bank ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-serif text-lg mb-4">{t("homework")}</h2>
        {homework.length === 0 ? (
          <p className="text-chalkDim text-sm mb-9">{t("noHomework")}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-9">
            {homework.map((h) => (
              <MaterialCard key={h.id} material={h} onToggleHomework={toggleHomework} />
            ))}
          </div>
        )}

        <h2 className="font-serif text-lg mb-4">{t("material")}</h2>
        {resources.length === 0 ? (
          <p className="text-chalkDim text-sm">{t("noMaterial")}</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

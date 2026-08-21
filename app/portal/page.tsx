"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getStudentClasses, ClassSession } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";

export default function PortalDashboard() {
  const { user, profile } = useAuth();
  const { t, lang } = useLang();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      getStudentClasses(user.uid).then((c) => {
        setClasses(c);
        setLoadingData(false);
      });
    }
  }, [user]);

  const upcoming = classes
    .filter((c) => new Date(c.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const nextClass = upcoming[0];

  const quickLinks = [
    { href: "/portal/classes", icon: "📅", label: t("goToClasses") },
    { href: "/portal/materials", icon: "📚", label: t("goToMaterial") },
    { href: "/portal/payment", icon: "💳", label: t("goToPayment") },
    { href: "/portal/chat", icon: "🤖", label: t("goToChat") },
  ];

  return (
    <>
      <div className="mb-9">
        <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
          {t("welcomeBack")}
        </span>
        <h1 className="font-serif text-3xl">
          {t("greeting")} {profile?.name || ""} <span className="text-gold">👋</span>
        </h1>
      </div>

      <h2 className="font-serif text-lg mb-4">{t("nextClass")}</h2>
      {loadingData ? (
        <p className="text-chalkDim text-sm mb-9">{t("loading")}</p>
      ) : !nextClass ? (
        <p className="text-chalkDim text-sm mb-9">{t("noUpcomingClass")}</p>
      ) : (
        <div className="bg-card border border-line/10 rounded-xl p-5 flex justify-between items-center gap-4 mb-9">
          <div>
            <p className="font-serif capitalize">
              {new Date(nextClass.startsAt).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              —{" "}
              {new Date(nextClass.startsAt).toLocaleTimeString(lang === "es" ? "es-CO" : "en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-chalkDim text-sm">{nextClass.durationMinutes} min</p>
          </div>
          {nextClass.teamsLink && (
            <a
              href={nextClass.teamsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-ink text-sm font-medium px-4 py-2 rounded-lg shrink-0"
            >
              {t("join")}
            </a>
          )}
        </div>
      )}

      <h2 className="font-serif text-lg mb-4">{t("quickLinksTitle")}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="bg-card border border-line/10 rounded-xl p-5 hover:border-gold/40 transition flex items-center gap-3"
          >
            <span className="text-xl">{q.icon}</span>
            <span className="text-sm">{q.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}

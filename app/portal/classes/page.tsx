"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getStudentClasses, ClassSession } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";

export default function ClassesPage() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const calendarUrl = user
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/api/calendar/${user.uid}`
    : "";

  function copyCalendarLink() {
    navigator.clipboard.writeText(calendarUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <h1 className="font-serif text-3xl mb-8">{t("classesTitle")}</h1>

      {loadingData ? (
        <p className="text-chalkDim text-sm mb-9">{t("loading")}</p>
      ) : upcoming.length === 0 ? (
        <p className="text-chalkDim text-sm mb-9">{t("noUpcomingClasses")}</p>
      ) : (
        <div className="flex flex-col gap-3 mb-9">
          {upcoming.map((c) => {
            const d = new Date(c.startsAt);
            const locale = lang === "es" ? "es-CO" : "en-US";
            const dateLabel = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
            const timeLabel = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
            return (
              <div
                key={c.id}
                className="bg-card border border-white/10 rounded-xl p-5 flex justify-between items-center gap-4"
              >
                <div>
                  <p className="font-serif capitalize">
                    {dateLabel} — {timeLabel}
                  </p>
                  <p className="text-chalkDim text-sm">{c.durationMinutes} min</p>
                </div>
                {c.teamsLink && (
                  <a
                    href={c.teamsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gold text-ink text-sm font-medium px-4 py-2 rounded-lg shrink-0"
                  >
                    {t("join")}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-card border border-white/10 rounded-xl p-5">
        <p className="text-sm mb-2">{t("syncCalendarTitle")}</p>
        <p className="text-chalkDim text-xs mb-3">{t("syncCalendarBody")}</p>
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
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>
    </>
  );
}

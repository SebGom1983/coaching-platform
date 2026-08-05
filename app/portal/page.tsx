"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { auth, getStudentData } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";

type StudentData = {
  name: string;
  nextLesson: { title: string; date: string; time: string };
  package: { total: number; used: number };
  homework: { title: string; status: "done" | "pending"; note: string }[];
  progress: Record<string, number>;
};

export default function Portal() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [data, setData] = useState<StudentData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch this student's own document from Firestore
  useEffect(() => {
    if (user) {
      getStudentData(user.uid).then((d) => {
        setData(d as StudentData | null);
        setLoadingData(false);
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  if (loadingData) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando tus datos...</div>;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-chalkDim mb-4">
            Todavía no hay datos para tu cuenta. Pídele a tu profesor que cree tu perfil en Firestore
            (colección <code className="text-gold">students</code>, documento con ID {user.uid}).
          </p>
          <button onClick={() => signOut(auth)} className="text-sm text-muted underline">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

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
              Hola, {data.name} <span className="text-gold">👋</span>
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 mb-5">
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
              NEXT LESSON
            </span>
            <h3 className="font-serif text-xl mt-4 mb-1">{data.nextLesson.title}</h3>
            <div className="text-chalkDim text-sm">
              {data.nextLesson.date} · <strong className="text-chalk">{data.nextLesson.time}</strong>
            </div>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-6">
            <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
              PACKAGE
            </span>
            <div className="font-mono text-2xl text-gold mt-3">
              {data.package.used}
              <span className="text-base text-muted"> / {data.package.total} lessons</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-gold"
                style={{ width: `${(data.package.used / data.package.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="font-serif text-lg mt-9 mb-4">{t("homework")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.homework.map((h) => (
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
          {Object.entries(data.progress).map(([label, pct]) => (
            <div key={label} className="flex items-center gap-3">
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

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { auth, getStudentMaterials, setMaterialStatus, Material, MaterialType } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";

const typeLabel: Record<MaterialType, string> = {
  video: "Video",
  link: "Enlace / recurso",
  text: "Nota",
  homework: "Tarea",
};

export default function Portal() {
  const { user, profile, loading: authLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch this student's own material from Firestore
  useEffect(() => {
    if (user) {
      getStudentMaterials(user.uid).then((m) => {
        setMaterials(m);
        setLoadingData(false);
      });
    }
  }, [user]);

  async function toggleHomework(m: Material) {
    const next = m.status === "done" ? "pending" : "done";
    await setMaterialStatus(m.id, next);
    setMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: next } : x)));
  }

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  if (loadingData) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando tus datos...</div>;
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
          <a className="px-3 py-2.5 rounded-lg bg-gold/10 text-gold font-medium">Panel</a>
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
              Hi, {profile?.name || ""} <span className="text-gold">👋</span>
            </h1>
          </div>
        </div>

        <h2 className="font-serif text-lg mb-4">{t("homework")}</h2>
        {homework.length === 0 ? (
          <p className="text-chalkDim text-sm mb-9">Todavía no tienes tareas asignadas.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-9">
            {homework.map((h) => (
              <button
                key={h.id}
                onClick={() => toggleHomework(h)}
                className="text-left bg-card border border-white/10 rounded-xl p-5 hover:border-gold/40 transition"
              >
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
                {h.description && <p className="text-chalkDim text-sm">{h.description}</p>}
              </button>
            ))}
          </div>
        )}

        <h2 className="font-serif text-lg mb-4">Material</h2>
        {resources.length === 0 ? (
          <p className="text-chalkDim text-sm">Todavía no tienes material asignado.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {resources.map((m) => (
              <div key={m.id} className="bg-card border border-white/10 rounded-xl p-5">
                <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-0.5 rounded-full">
                  {typeLabel[m.type]}
                </span>
                <h4 className="font-serif mt-2">{m.title}</h4>
                {m.url && (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold text-sm break-all"
                  >
                    {m.url}
                  </a>
                )}
                {m.description && <p className="text-chalkDim text-sm mt-1">{m.description}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

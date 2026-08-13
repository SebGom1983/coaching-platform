"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { auth, getStudentMaterials, setMaterialStatus, Material } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";
import MaterialCard from "../components/MaterialCard";

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

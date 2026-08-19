"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getStudentMaterials, setMaterialStatus, Material } from "@/lib/firebase";
import { useLang } from "@/lib/i18n";
import MaterialCard from "../../components/MaterialCard";

export default function MaterialsPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  if (loadingData) {
    return <p className="text-chalkDim text-sm">{t("loadingData")}</p>;
  }

  const homework = materials.filter((m) => m.type === "homework");
  const resources = materials.filter((m) => m.type !== "homework");

  return (
    <>
      <h1 className="font-serif text-3xl mb-8">{t("navMaterial")}</h1>

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
    </>
  );
}

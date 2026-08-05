"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  auth,
  getUserProfile,
  getStudentMaterials,
  addMaterial,
  deleteMaterial,
  UserProfile,
  Material,
  MaterialType,
} from "@/lib/firebase";

const typeLabel: Record<MaterialType, string> = {
  video: "Video",
  link: "Enlace / recurso",
  text: "Nota / texto",
  homework: "Tarea",
};

export default function StudentEditor() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [type, setType] = useState<MaterialType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (profile && profile.role !== "teacher") router.push("/portal");
    }
  }, [authLoading, user, profile, router]);

  async function loadData() {
    const [s, m] = await Promise.all([getUserProfile(studentId), getStudentMaterials(studentId)]);
    setStudent(s);
    setMaterials(m);
    setLoadingData(false);
  }

  useEffect(() => {
    if (profile?.role === "teacher" && studentId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, studentId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await addMaterial(studentId, { type, title, url, description });
    setTitle("");
    setUrl("");
    setDescription("");
    await loadData();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  if (authLoading || !profile || profile.role !== "teacher" || loadingData) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-white/10 p-6 flex flex-col">
        <div className="font-serif font-semibold mb-10">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <nav className="flex flex-col gap-1 flex-1 text-sm">
          <Link href="/teacher" className="px-3 py-2.5 rounded-lg text-chalkDim">
            ← Alumnos
          </Link>
        </nav>
        <button onClick={() => signOut(auth)} className="text-left text-xs text-muted px-3 py-2">
          Cerrar sesión
        </button>
      </aside>

      <main className="p-10 max-w-3xl">
        <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
          MATERIAL DEL ALUMNO
        </span>
        <h1 className="font-serif text-3xl mb-1">{student?.name || "Alumno"}</h1>
        <p className="text-chalkDim text-sm mb-8">{student?.email}</p>

        <form onSubmit={handleAdd} className="bg-card border border-white/10 rounded-2xl p-6 mb-9">
          <h2 className="font-serif text-lg mb-4">Agregar material</h2>

          <label className="block text-xs text-muted mb-1.5">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MaterialType)}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          >
            <option value="link">Enlace / recurso (TED, artículo, podcast...)</option>
            <option value="video">Video (YouTube, Vimeo...)</option>
            <option value="text">Nota / texto</option>
            <option value="homework">Tarea</option>
          </select>

          <label className="block text-xs text-muted mb-1.5">Título</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: TED Talk — The power of vulnerability"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          {type !== "text" && (
            <>
              <label className="block text-xs text-muted mb-1.5">Enlace (URL)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
              />
            </>
          )}

          <label className="block text-xs text-muted mb-1.5">
            {type === "text" ? "Contenido" : "Notas / instrucciones (opcional)"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Agregar"}
          </button>
        </form>

        <h2 className="font-serif text-lg mb-4">Material asignado</h2>
        {materials.length === 0 ? (
          <p className="text-chalkDim text-sm">Todavía no le has asignado nada a este alumno.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {materials.map((m) => (
              <div key={m.id} className="bg-card border border-white/10 rounded-xl p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
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
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-muted hover:text-red-400 shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

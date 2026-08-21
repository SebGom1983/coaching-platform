"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import ThemeToggle from "../../components/ThemeToggle";
import {
  auth,
  getUserProfile,
  getStudentMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getStudentClasses,
  addClassSession,
  updateClassSession,
  deleteClassSession,
  UserProfile,
  Material,
  MaterialType,
  ClassSession,
} from "@/lib/firebase";
import MaterialCard from "../../components/MaterialCard";

export default function StudentEditor() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [type, setType] = useState<MaterialType>("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (profile && profile.role !== "teacher") router.push("/portal");
    }
  }, [authLoading, user, profile, router]);

  async function loadData() {
    const [s, m, c] = await Promise.all([
      getUserProfile(studentId),
      getStudentMaterials(studentId),
      getStudentClasses(studentId),
    ]);
    setStudent(s);
    setMaterials(m);
    setClasses(c);
    setLoadingData(false);
  }

  useEffect(() => {
    if (profile?.role === "teacher" && studentId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, studentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    if (editingId) {
      await updateMaterial(editingId, { type, title, url, description, thumbnailUrl });
    } else {
      await addMaterial(studentId, { type, title, url, description, thumbnailUrl });
    }
    resetForm();
    await loadData();
    setSaving(false);
  }

  function resetForm() {
    setEditingId(null);
    setType("link");
    setTitle("");
    setUrl("");
    setDescription("");
    setThumbnailUrl("");
  }

  function handleEdit(m: Material) {
    setEditingId(m.id);
    setType(m.type);
    setTitle(m.title);
    setUrl(m.url || "");
    setDescription(m.description || "");
    setThumbnailUrl(m.thumbnailUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    await deleteMaterial(id);
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  // --- Class scheduling ---
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classDuration, setClassDuration] = useState(60);
  const [classTeamsLink, setClassTeamsLink] = useState("");
  const [classNotes, setClassNotes] = useState("");
  const [savingClass, setSavingClass] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  async function handleClassSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!classDate || !classTime) return;
    setSavingClass(true);
    const startsAt = `${classDate}T${classTime}:00`;
    if (editingClassId) {
      await updateClassSession(editingClassId, {
        startsAt,
        durationMinutes: classDuration,
        teamsLink: classTeamsLink,
        notes: classNotes,
      });
    } else {
      await addClassSession(studentId, {
        startsAt,
        durationMinutes: classDuration,
        teamsLink: classTeamsLink,
        notes: classNotes,
      });
    }
    resetClassForm();
    await loadData();
    setSavingClass(false);
  }

  function resetClassForm() {
    setEditingClassId(null);
    setClassDate("");
    setClassTime("");
    setClassDuration(60);
    setClassTeamsLink("");
    setClassNotes("");
  }

  function handleClassEdit(c: ClassSession) {
    setEditingClassId(c.id);
    const [d, t] = c.startsAt.split("T");
    setClassDate(d);
    setClassTime((t || "").slice(0, 5));
    setClassDuration(c.durationMinutes);
    setClassTeamsLink(c.teamsLink || "");
    setClassNotes(c.notes || "");
  }

  async function handleClassDelete(id: string) {
    await deleteClassSession(id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
  }

  if (authLoading || !profile || profile.role !== "teacher" || loadingData) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-line/10 p-6 flex flex-col">
        <div className="font-serif font-semibold mb-10">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <nav className="flex flex-col gap-1 flex-1 text-sm">
          <Link href="/teacher" className="px-3 py-2.5 rounded-lg text-chalkDim">
            ← Alumnos
          </Link>
          <Link href="/teacher/content" className="px-3 py-2.5 rounded-lg text-chalkDim hover:bg-line/5">
            Contenido del sitio
          </Link>
        </nav>
        <div className="px-1 mb-2"><ThemeToggle /></div>
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

        {/* --- Classes --- */}
        <form onSubmit={handleClassSubmit} className="bg-card border border-line/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">{editingClassId ? "Editar clase" : "Agendar clase"}</h2>
            {editingClassId && (
              <button type="button" onClick={resetClassForm} className="text-xs text-muted hover:text-chalk">
                Cancelar edición
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Fecha</label>
              <input
                type="date"
                required
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Hora</label>
              <input
                type="time"
                required
                value={classTime}
                onChange={(e) => setClassTime(e.target.value)}
                className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          <label className="block text-xs text-muted mb-1.5">Duración (minutos)</label>
          <input
            type="number"
            min={15}
            step={15}
            value={classDuration}
            onChange={(e) => setClassDuration(Number(e.target.value))}
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Link de Teams (opcional)</label>
          <input
            type="url"
            value={classTeamsLink}
            onChange={(e) => setClassTeamsLink(e.target.value)}
            placeholder="https://teams.microsoft.com/..."
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Notas (opcional)</label>
          <textarea
            value={classNotes}
            onChange={(e) => setClassNotes(e.target.value)}
            rows={2}
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={savingClass}
            className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {savingClass ? "Guardando..." : editingClassId ? "Guardar cambios" : "Agendar"}
          </button>
        </form>

        <h2 className="font-serif text-lg mb-4">Clases agendadas</h2>
        {classes.length === 0 ? (
          <p className="text-chalkDim text-sm mb-9">Todavía no le has agendado ninguna clase.</p>
        ) : (
          <div className="flex flex-col gap-3 mb-9">
            {classes.map((c) => {
              const d = new Date(c.startsAt);
              const dateLabel = d.toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });
              const timeLabel = d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={c.id} className="bg-card border border-line/10 rounded-xl p-5 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-serif capitalize">{dateLabel} — {timeLabel}</p>
                    <p className="text-chalkDim text-sm">{c.durationMinutes} min</p>
                    {c.teamsLink && (
                      <a href={c.teamsLink} target="_blank" rel="noopener noreferrer" className="text-gold text-sm hover:underline">
                        Link de Teams
                      </a>
                    )}
                    {c.notes && <p className="text-chalkDim text-sm mt-1">{c.notes}</p>}
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button onClick={() => handleClassEdit(c)} className="text-xs text-muted hover:text-gold">
                      Editar
                    </button>
                    <button onClick={() => handleClassDelete(c.id)} className="text-xs text-muted hover:text-red-400">
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-chalkDim text-xs mb-9">
          Tu alumno puede suscribir su calendario para ver estas clases automáticamente desde su portal.
        </p>

        <form onSubmit={handleSubmit} className="bg-card border border-line/10 rounded-2xl p-6 mb-9">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg">{editingId ? "Editar material" : "Agregar material"}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-xs text-muted hover:text-chalk">
                Cancelar edición
              </button>
            )}
          </div>

          <label className="block text-xs text-muted mb-1.5">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MaterialType)}
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
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
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          {type !== "text" && (
            <>
              <label className="block text-xs text-muted mb-1.5">Enlace (URL)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
              />

              <label className="block text-xs text-muted mb-1.5">
                Imagen de portada (opcional — solo si el link no trae una automática)
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://... (link directo a una imagen .jpg / .png)"
                className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
              />
              <p className="text-xs text-muted -mt-3 mb-4">
                Tip: busca la imagen en Google → clic derecho → "Copiar dirección de imagen" → pégala aquí.
              </p>
            </>
          )}

          <label className="block text-xs text-muted mb-1.5">
            {type === "text" ? "Contenido" : "Notas / instrucciones (opcional)"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar"}
          </button>
        </form>

        <h2 className="font-serif text-lg mb-4">Material asignado</h2>
        {materials.length === 0 ? (
          <p className="text-chalkDim text-sm">Todavía no le has asignado nada a este alumno.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {materials.map((m) => (
              <MaterialCard key={m.id} material={m} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

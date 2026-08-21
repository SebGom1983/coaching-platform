"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  auth,
  getSiteAbout,
  updateSiteAbout,
  getClassVideos,
  addClassVideo,
  deleteClassVideo,
  SiteAbout,
  ClassVideo,
} from "@/lib/firebase";

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  // Already a bare ID (11 chars, no slashes/dots)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.searchParams.get("v")) return url.searchParams.get("v")!;
    const parts = url.pathname.split("/");
    return parts[parts.length - 1];
  } catch {
    return trimmed;
  }
}

export default function SiteContentPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [about, setAbout] = useState<SiteAbout | null>(null);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutSaved, setAboutSaved] = useState(false);

  const [videos, setVideos] = useState<ClassVideo[]>([]);
  const [videoInput, setVideoInput] = useState("");
  const [titleEs, setTitleEs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
      else if (profile && profile.role !== "teacher") router.push("/portal");
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    if (profile?.role === "teacher") {
      getSiteAbout().then(setAbout);
      getClassVideos().then(setVideos);
    }
  }, [profile]);

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    if (!about) return;
    setSavingAbout(true);
    await updateSiteAbout(about);
    setSavingAbout(false);
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!videoInput.trim() || !titleEs.trim()) return;
    setSavingVideo(true);
    const youtubeId = extractYoutubeId(videoInput);
    await addClassVideo({ youtubeId, titleEs, titleEn: titleEn || titleEs });
    setVideoInput("");
    setTitleEs("");
    setTitleEn("");
    setVideos(await getClassVideos());
    setSavingVideo(false);
  }

  async function handleDeleteVideo(id: string) {
    await deleteClassVideo(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  if (authLoading || !profile || profile.role !== "teacher" || !about) {
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
          <a className="px-3 py-2.5 rounded-lg bg-gold/10 text-gold font-medium">Contenido del sitio</a>
        </nav>
        <button onClick={() => signOut(auth)} className="text-left text-xs text-muted px-3 py-2">
          Cerrar sesión
        </button>
      </aside>

      <main className="p-10 max-w-3xl">
        <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
          LANDING PAGE
        </span>
        <h1 className="font-serif text-3xl mb-8">Contenido del sitio</h1>

        {/* --- About me editor --- */}
        <form onSubmit={handleSaveAbout} className="bg-card border border-white/10 rounded-2xl p-6 mb-9">
          <h2 className="font-serif text-lg mb-4">Sobre mí</h2>

          <label className="block text-xs text-muted mb-1.5">Título (Español)</label>
          <input
            value={about.titleEs}
            onChange={(e) => setAbout({ ...about, titleEs: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />
          <label className="block text-xs text-muted mb-1.5">Título (English)</label>
          <input
            value={about.titleEn}
            onChange={(e) => setAbout({ ...about, titleEn: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Párrafo 1 (Español)</label>
          <textarea
            rows={3}
            value={about.body1Es}
            onChange={(e) => setAbout({ ...about, body1Es: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />
          <label className="block text-xs text-muted mb-1.5">Párrafo 1 (English)</label>
          <textarea
            rows={3}
            value={about.body1En}
            onChange={(e) => setAbout({ ...about, body1En: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Párrafo 2 (Español)</label>
          <textarea
            rows={3}
            value={about.body2Es}
            onChange={(e) => setAbout({ ...about, body2Es: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />
          <label className="block text-xs text-muted mb-1.5">Párrafo 2 (English)</label>
          <textarea
            rows={3}
            value={about.body2En}
            onChange={(e) => setAbout({ ...about, body2En: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Foto para el Hero (arriba de todo)</label>
          {about.heroPhotoUrl && (
            <div className="relative w-32 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.heroPhotoUrl} alt="" className="w-32 aspect-square object-cover rounded-lg border border-white/10" />
            </div>
          )}
          <input
            value={about.heroPhotoUrl}
            onChange={(e) => setAbout({ ...about, heroPhotoUrl: e.target.value })}
            placeholder="https://i.postimg.cc/... o https://i.imgur.com/....jpg"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-1 text-sm outline-none focus:border-gold"
          />
          <p className="text-xs text-muted mb-4">
            Debe ser el link directo a la imagen (termina en .jpg o .png), no el link de la página del álbum.
          </p>

          <label className="block text-xs text-muted mb-1.5">Foto para "Sobre mí"</label>
          {about.aboutPhotoUrl && (
            <div className="relative w-32 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.aboutPhotoUrl} alt="" className="w-32 aspect-square object-cover rounded-lg border border-white/10" />
            </div>
          )}
          <input
            value={about.aboutPhotoUrl}
            onChange={(e) => setAbout({ ...about, aboutPhotoUrl: e.target.value })}
            placeholder="https://i.postimg.cc/... o https://i.imgur.com/....jpg"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-1 text-sm outline-none focus:border-gold"
          />
          <p className="text-xs text-muted mb-4">
            Puede ser la misma foto del Hero, u otra distinta — este campo es independiente.
          </p>

          <label className="block text-xs text-muted mb-1.5">Instagram (URL completa)</label>
          <input
            value={about.instagramUrl}
            onChange={(e) => setAbout({ ...about, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/tu_usuario"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">LinkedIn (URL completa)</label>
          <input
            value={about.linkedinUrl}
            onChange={(e) => setAbout({ ...about, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/tu-usuario"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={savingAbout}
            className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {savingAbout ? "Guardando..." : aboutSaved ? "¡Guardado!" : "Guardar cambios"}
          </button>
        </form>

        {/* --- Videos manager --- */}
        <form onSubmit={handleAddVideo} className="bg-card border border-white/10 rounded-2xl p-6 mb-9">
          <h2 className="font-serif text-lg mb-4">Agregar video de clase real</h2>

          <label className="block text-xs text-muted mb-1.5">Link o ID de YouTube</label>
          <input
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Título (Español)</label>
          <input
            value={titleEs}
            onChange={(e) => setTitleEs(e.target.value)}
            placeholder="Ej: Clase de conversación — nivel intermedio"
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
          />

          <label className="block text-xs text-muted mb-1.5">Título (English) — opcional</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
          />

          <button
            type="submit"
            disabled={savingVideo}
            className="bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {savingVideo ? "Guardando..." : "Agregar video"}
          </button>
        </form>

        <h2 className="font-serif text-lg mb-4">Videos publicados</h2>
        {videos.length === 0 ? (
          <p className="text-chalkDim text-sm">Todavía no has agregado ningún video.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {videos.map((v) => (
              <div key={v.id} className="bg-card border border-white/10 rounded-xl p-4 flex justify-between items-center gap-4">
                <div>
                  <p className="text-sm">{v.titleEs}</p>
                  <p className="text-muted text-xs font-mono">{v.youtubeId}</p>
                </div>
                <button onClick={() => handleDeleteVideo(v.id)} className="text-xs text-muted hover:text-red-400 shrink-0">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

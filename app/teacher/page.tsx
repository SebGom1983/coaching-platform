"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { auth, getAllStudents, UserProfile } from "@/lib/firebase";

const programLabel: Record<string, string> = {
  interchange: "Interchange",
  business: "Business / Conversational",
};

export default function TeacherDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Only teachers can see this page
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (profile && profile.role !== "teacher") {
        router.push("/portal");
      }
    }
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    if (profile?.role === "teacher") {
      getAllStudents().then((s) => {
        setStudents(s);
        setLoadingStudents(false);
      });
    }
  }, [profile]);

  if (authLoading || !profile || profile.role !== "teacher") {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-white/10 p-6 flex flex-col">
        <div className="font-serif font-semibold mb-10">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <nav className="flex flex-col gap-1 flex-1 text-sm">
          <a className="px-3 py-2.5 rounded-lg bg-gold/10 text-gold font-medium">Alumnos</a>
          <Link href="/teacher/content" className="px-3 py-2.5 rounded-lg text-chalkDim hover:bg-white/5">
            Contenido del sitio
          </Link>
        </nav>
        <button onClick={() => signOut(auth)} className="text-left text-xs text-muted px-3 py-2">
          Cerrar sesión
        </button>
      </aside>

      <main className="p-10 max-w-4xl">
        <span className="block font-mono text-xs uppercase tracking-widest text-sageSoft mb-2">
          PANEL DEL PROFESOR
        </span>
        <h1 className="font-serif text-3xl mb-8">Tus alumnos</h1>

        {loadingStudents ? (
          <p className="text-chalkDim">Cargando alumnos...</p>
        ) : students.length === 0 ? (
          <div className="bg-card border border-white/10 rounded-2xl p-6 text-chalkDim text-sm">
            Todavía no hay alumnos registrados. Comparte el link de registro con ellos:{" "}
            <code className="text-gold">tu-dominio.com/signup</code>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {students.map((s) => (
              <Link
                key={s.uid}
                href={`/teacher/${s.uid}`}
                className="bg-card border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition"
              >
                <h3 className="font-serif text-lg mb-1">{s.name}</h3>
                <p className="text-chalkDim text-sm mb-3">{s.email}</p>
                <span className="font-mono text-xs text-sageSoft bg-sage/15 px-2.5 py-1 rounded-full">
                  {programLabel[s.programType || "interchange"]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

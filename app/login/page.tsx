"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, getUserProfile } from "@/lib/firebase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getUserProfile(cred.user.uid);
      if (profile?.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/portal");
      }
    } catch (err: any) {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-line/10 rounded-2xl p-8 w-full max-w-sm"
      >
        <div className="font-serif font-semibold text-lg mb-1">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <p className="text-chalkDim text-sm mb-6">Inicia sesión en tu portal</p>

        <label className="block text-xs text-muted mb-1.5">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
        />

        <label className="block text-xs text-muted mb-1.5">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink border border-line/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-ink font-medium text-sm py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-center text-xs text-muted mt-5">
          ¿Eres alumno nuevo?{" "}
          <Link href="/signup" className="text-gold">
            Crea tu cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}

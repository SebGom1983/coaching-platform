"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, createUserProfile, ProgramType } from "@/lib/firebase";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [programType, setProgramType] = useState<ProgramType>("interchange");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(cred.user.uid, { name, email, programType });
      router.push("/portal");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Ese correo ya tiene una cuenta. Inicia sesión.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("No pudimos crear tu cuenta. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-white/10 rounded-2xl p-8 w-full max-w-sm"
      >
        <div className="font-serif font-semibold text-lg mb-1">
          Seb<span className="text-gold">.</span> Coaching
        </div>
        <p className="text-chalkDim text-sm mb-6">Crea tu cuenta de alumno</p>

        <label className="block text-xs text-muted mb-1.5">Nombre</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
        />

        <label className="block text-xs text-muted mb-1.5">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
        />

        <label className="block text-xs text-muted mb-1.5">Contraseña</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:border-gold"
        />

        <label className="block text-xs text-muted mb-1.5">Tipo de programa</label>
        <select
          value={programType}
          onChange={(e) => setProgramType(e.target.value as ProgramType)}
          className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2.5 mb-5 text-sm outline-none focus:border-gold"
        >
          <option value="interchange">Interchange (básico / intermedio)</option>
          <option value="business">Business / Conversational</option>
        </select>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-ink font-medium text-sm py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="text-center text-xs text-muted mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-gold">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

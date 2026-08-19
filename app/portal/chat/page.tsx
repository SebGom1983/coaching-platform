"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type ChatMessage = { role: "user" | "model"; text: string };

export default function AiChatPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hi! I'm your English practice partner. Tell me about your day, ask me a grammar question, or just say hello — let's chat! 🙂",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, programType: profile?.programType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch {
      setError("No se pudo conectar con la IA. Intenta de nuevo en un momento.");
    } finally {
      setSending(false);
    }
  }

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/portal" className="text-xs text-muted hover:text-chalk">
            ← Volver al portal
          </Link>
          <h1 className="font-serif text-2xl mt-1">Practicar con IA 🤖</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end bg-gold text-ink rounded-br-sm"
                : "self-start bg-card border border-white/10 rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {sending && (
          <div className="self-start bg-card border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-chalkDim">
            Escribiendo...
          </div>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 sticky bottom-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe en inglés o español..."
          disabled={sending}
          className="flex-1 bg-card border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-gold text-ink font-medium text-sm px-5 py-3 rounded-xl disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

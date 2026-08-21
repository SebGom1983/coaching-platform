"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";

type ChatMessage = { role: "user" | "model"; text: string };

export default function AiChatPage() {
  const { user, profile } = useAuth();
  const { t } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "model", text: t("aiChatWelcome") }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
      setError(t("aiChatError"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-2xl">
      <h1 className="font-serif text-2xl mb-6">{t("aiChatTitle")}</h1>

      <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end bg-gold text-ink rounded-br-sm"
                : "self-start bg-card border border-line/10 rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {sending && (
          <div className="self-start bg-card border border-line/10 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-chalkDim">
            {t("typing")}
          </div>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("aiChatPlaceholder")}
          disabled={sending}
          className="flex-1 bg-card border border-line/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-gold text-ink font-medium text-sm px-5 py-3 rounded-xl disabled:opacity-50"
        >
          {t("send")}
        </button>
      </form>
    </div>
  );
}

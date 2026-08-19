import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a friendly, encouraging English tutor helping a Spanish-speaking
student practice conversation and grammar. Rules:
- Reply mostly in English, at a level appropriate to the student (adjust to what they write).
- If the student makes a grammar or vocabulary mistake, gently point it out with a short
  correction and a one-line explanation, then continue the conversation naturally.
- Keep replies conversational and fairly short (2-5 sentences) — this is a chat, not an essay.
- If the student writes in Spanish, you can reply in Spanish for the explanation but encourage
  them to try in English.
- Be warm and patient. Never be condescending.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI chat is not configured yet." }, { status: 500 });
  }

  const { messages, programType } = await req.json();
  // messages: [{ role: "user" | "model", text: string }, ...]

  const levelHint =
    programType === "business"
      ? "This student is in a business/conversational English program — use more advanced, professional vocabulary."
      : "This student is following the Interchange basic/intermediate curriculum — keep vocabulary simple and clear.";

  const contents = [
    { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${levelHint}` }] },
    { role: "model", parts: [{ text: "Understood! I'm ready to chat with the student." }] },
    ...messages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: "AI request failed", details: errText }, { status: 502 });
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Try again?";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}

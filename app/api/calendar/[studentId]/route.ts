import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { buildIcsCalendar, IcsEvent } from "@/lib/ics";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;

  try {
    const db = getAdminDb();

    const [userSnap, classesSnap] = await Promise.all([
      db.collection("users").doc(studentId).get(),
      db.collection("classes").where("studentId", "==", studentId).get(),
    ]);

    const studentName = userSnap.exists ? userSnap.data()?.name : "Alumno";

    const events: IcsEvent[] = classesSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: "Clase de inglés — Seb Coaching",
        startsAt: data.startsAt,
        durationMinutes: data.durationMinutes || 60,
        description: data.notes || "",
        location: data.teamsLink || "",
      };
    });

    const ics = buildIcsCalendar(`Clases — ${studentName}`, events);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename="clases.ics"`,
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo generar el calendario" }, { status: 500 });
  }
}

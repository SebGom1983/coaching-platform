import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// TODO: replace with your own Firebase project config
// (Firebase console → Project settings → General → Your apps → SDK config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// -----------------------------------------------------------------------
// Users (teacher + students)
// One document per person in "users", document ID = Firebase Auth UID.
// -----------------------------------------------------------------------

export type ProgramType = "interchange" | "business";
export type Role = "teacher" | "student";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  programType?: ProgramType;
  createdAt?: any;
};

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null;
}

export async function createUserProfile(
  uid: string,
  data: { name: string; email: string; programType: ProgramType }
) {
  await setDoc(doc(db, "users", uid), {
    name: data.name,
    email: data.email,
    role: "student",
    programType: data.programType,
    createdAt: serverTimestamp(),
  });
}

export async function getAllStudents(): Promise<UserProfile[]> {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
}

// -----------------------------------------------------------------------
// Materials (videos, links, text notes, homework) assigned by the teacher
// to a specific student. Top-level "materials" collection, each doc tagged
// with studentId so it can be queried per student.
// -----------------------------------------------------------------------

export type MaterialType = "video" | "link" | "text" | "homework";

export type Material = {
  id: string;
  studentId: string;
  type: MaterialType;
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string; // manual override, used when there's no automatic thumbnail
  status?: "pending" | "done"; // only meaningful for homework
  createdAt?: any;
};

export async function addMaterial(
  studentId: string,
  data: { type: MaterialType; title: string; description?: string; url?: string; thumbnailUrl?: string }
) {
  await addDoc(collection(db, "materials"), {
    studentId,
    type: data.type,
    title: data.title,
    description: data.description || "",
    url: data.url || "",
    thumbnailUrl: data.thumbnailUrl || "",
    ...(data.type === "homework" ? { status: "pending" } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function getStudentMaterials(studentId: string): Promise<Material[]> {
  const q = query(
    collection(db, "materials"),
    where("studentId", "==", studentId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Material));
}

export async function setMaterialStatus(materialId: string, status: "pending" | "done") {
  await updateDoc(doc(db, "materials", materialId), { status });
}

export async function updateMaterial(
  materialId: string,
  data: { type: MaterialType; title: string; description?: string; url?: string; thumbnailUrl?: string }
) {
  await updateDoc(doc(db, "materials", materialId), {
    type: data.type,
    title: data.title,
    description: data.description || "",
    url: data.url || "",
    thumbnailUrl: data.thumbnailUrl || "",
  });
}

export async function deleteMaterial(materialId: string) {
  await deleteDoc(doc(db, "materials", materialId));
}

// -----------------------------------------------------------------------
// Classes (scheduled Teams lessons) — top-level "classes" collection,
// each doc tagged with studentId, one class = one date/time + Teams link.
// -----------------------------------------------------------------------

export type ClassSession = {
  id: string;
  studentId: string;
  startsAt: string; // ISO datetime string, e.g. "2026-08-20T15:00:00"
  durationMinutes: number;
  teamsLink?: string;
  notes?: string;
  createdAt?: any;
};

export async function addClassSession(
  studentId: string,
  data: { startsAt: string; durationMinutes: number; teamsLink?: string; notes?: string }
) {
  await addDoc(collection(db, "classes"), {
    studentId,
    startsAt: data.startsAt,
    durationMinutes: data.durationMinutes,
    teamsLink: data.teamsLink || "",
    notes: data.notes || "",
    createdAt: serverTimestamp(),
  });
}

export async function getStudentClasses(studentId: string): Promise<ClassSession[]> {
  const q = query(
    collection(db, "classes"),
    where("studentId", "==", studentId),
    orderBy("startsAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassSession));
}

export async function updateClassSession(
  classId: string,
  data: { startsAt: string; durationMinutes: number; teamsLink?: string; notes?: string }
) {
  await updateDoc(doc(db, "classes", classId), {
    startsAt: data.startsAt,
    durationMinutes: data.durationMinutes,
    teamsLink: data.teamsLink || "",
    notes: data.notes || "",
  });
}

export async function deleteClassSession(classId: string) {
  await deleteDoc(doc(db, "classes", classId));
}

// -----------------------------------------------------------------------
// Public site content — editable by the teacher, readable by anyone
// (the landing page has no login). Two pieces: the "About me" text/links,
// and the list of real class video clips.
// -----------------------------------------------------------------------

export type SiteAbout = {
  titleEs: string;
  titleEn: string;
  body1Es: string;
  body1En: string;
  body2Es: string;
  body2En: string;
  instagramUrl: string;
  linkedinUrl: string;
};

const DEFAULT_ABOUT: SiteAbout = {
  titleEs: "15+ años ayudando a personas reales a hablar inglés",
  titleEn: "15+ years helping real people speak English",
  body1Es:
    "Mi camino no empezó en un salón de clase. Trabajé como chef en cruceros internacionales para Celebrity Cruises, conviviendo a diario con personas de decenas de nacionalidades y culturas distintas. Esa experiencia me enseñó algo que ningún libro de gramática enseña: los idiomas se aprenden viviendo experiencias reales y conectando con personas.",
  body1En:
    "My path didn't start in a classroom. I worked as a chef on international cruise ships for Celebrity Cruises, living day to day with people from dozens of nationalities and cultures. That experience taught me something no grammar book can: languages are learned by living real experiences and connecting with people.",
  body2Es:
    "Desde entonces llevo más de 15 años como profesor y mentor de comunicación profesional — combinando mi experiencia en Berlitz con clases independientes aquí en Bogotá. Fuera de las clases, me vas a encontrar corriendo, cocinando, o metido en algún proyecto de programación — soy un entusiasta de la tecnología y desarrollador autodidacta, y esta misma plataforma la construí yo. Soy un libro abierto — pregúntame lo que quieras.",
  body2En:
    "Since then I've spent 15+ years as a teacher and professional communication mentor — combining my experience at Berlitz with independent classes here in Bogotá. Outside of class, you'll find me running, cooking, or deep in some coding project — I'm a self-taught developer and tech enthusiast, and I built this very platform myself. I'm an open book — ask me anything.",
  instagramUrl: "https://instagram.com/chefsebasgomez",
  linkedinUrl: "",
};

export async function getSiteAbout(): Promise<SiteAbout> {
  const snap = await getDoc(doc(db, "siteContent", "about"));
  return snap.exists() ? ({ ...DEFAULT_ABOUT, ...snap.data() } as SiteAbout) : DEFAULT_ABOUT;
}

export async function updateSiteAbout(data: SiteAbout) {
  await setDoc(doc(db, "siteContent", "about"), data);
}

export type ClassVideo = {
  id: string;
  youtubeId: string;
  titleEs: string;
  titleEn: string;
  createdAt?: any;
};

export async function getClassVideos(): Promise<ClassVideo[]> {
  const q = query(collection(db, "classVideos"), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassVideo));
}

export async function addClassVideo(data: { youtubeId: string; titleEs: string; titleEn: string }) {
  await addDoc(collection(db, "classVideos"), { ...data, createdAt: serverTimestamp() });
}

export async function deleteClassVideo(id: string) {
  await deleteDoc(doc(db, "classVideos", id));
}

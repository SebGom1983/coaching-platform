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
  status?: "pending" | "done"; // only meaningful for homework
  createdAt?: any;
};

export async function addMaterial(
  studentId: string,
  data: { type: MaterialType; title: string; description?: string; url?: string }
) {
  await addDoc(collection(db, "materials"), {
    studentId,
    type: data.type,
    title: data.title,
    description: data.description || "",
    url: data.url || "",
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
  data: { type: MaterialType; title: string; description?: string; url?: string }
) {
  await updateDoc(doc(db, "materials", materialId), {
    type: data.type,
    title: data.title,
    description: data.description || "",
    url: data.url || "",
  });
}

export async function deleteMaterial(materialId: string) {
  await deleteDoc(doc(db, "materials", materialId));
}

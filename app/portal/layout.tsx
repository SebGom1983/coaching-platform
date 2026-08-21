"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import LangToggle from "../components/LangToggle";
import ThemeToggle from "../components/ThemeToggle";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const navItems = [
    { href: "/portal", label: t("navPanel"), icon: "🏠" },
    { href: "/portal/classes", label: t("navClasses"), icon: "📅" },
    { href: "/portal/materials", label: t("navMaterial"), icon: "📚" },
    { href: "/portal/payment", label: t("navPayment"), icon: "💳" },
    { href: "/portal/chat", label: t("navAiChat"), icon: "🤖" },
  ];

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-chalkDim">{t("loading")}</div>;
  }

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink2 border-r border-line/10 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="font-serif font-semibold">
            Seb<span className="text-gold">.</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition ${
                  active ? "bg-gold/10 text-gold font-medium" : "text-chalkDim hover:bg-line/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => signOut(auth)} className="text-left text-xs text-muted px-3 py-2">
          {t("logout")}
        </button>
      </aside>

      <main className="p-8 md:p-10 max-w-3xl overflow-y-auto">{children}</main>
    </div>
  );
}

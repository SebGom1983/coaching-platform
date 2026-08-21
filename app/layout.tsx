import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { dict } from "./dictionary";

export const metadata = {
  title: "Seb — English Coaching",
  description: "Premium AI-powered English coaching platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <LangProvider dict={dict}>{children}</LangProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

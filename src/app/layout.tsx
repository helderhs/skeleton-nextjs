import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { DEFAULT_THEME_MODE } from "@/lib/theme";
import { getSessionUser } from "@/lib/session";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skeleton App — Dashboard Moderno",
  description:
    "Monolito moderno com Next.js, Material UI, MongoDB e autenticação completa.",
  keywords: ["Next.js", "Dashboard", "Material UI", "MongoDB", "TypeScript"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await getSessionUser();
  const initialMode = sessionUser?.themeMode ?? DEFAULT_THEME_MODE;

  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body data-theme={initialMode} suppressHydrationWarning>
        <ThemeRegistry initialMode={initialMode}>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

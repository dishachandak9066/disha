import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "READ-E-VERSE | AI-Powered Bookstore",
  description: "Experience a limitless library powered by AI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersList = await headers();

  const cookieHeader = headersList.get("cookie") ?? "";

  const themeCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("readeverse_theme="));

  const initialTheme = themeCookie
    ? decodeURIComponent(themeCookie.split("=")[1]) === "dark"
      ? "dark"
      : "light"
    : "light";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${
        initialTheme === "dark" ? "dark" : "light"
      }`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider initialTheme={initialTheme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
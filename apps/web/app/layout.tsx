import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "GetPet — Найди друга в Татарстане",
  description: "Сервис поиска питомцев из приютов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-50 text-slate-900`}>
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
            <span className="text-xl font-bold tracking-tight text-blue-600">GetPet</span>
            <div className="h-8 w-8 rounded-full bg-gray-200" /> {/* Placeholder для аватара */}
          </div>
        </header>

        <main className="mx-auto max-w-lg pb-20">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-3">
          <div className="mx-auto flex max-w-lg justify-between text-[10px] uppercase text-gray-400">
            <span className="text-blue-600 font-bold">Поиск</span>
            <span>Избранное</span>
            <span>Мои объявления</span>
          </div>
        </nav>
      </body>
    </html>
  );
}

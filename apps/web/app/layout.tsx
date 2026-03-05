import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "GetPet — Найди друга в Татарстане",
  description: "Сервис поиска питомцев из приютов",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#F9FAFB] text-[#1F2937]`}>
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-6">
            <span className="text-2xl font-black tracking-tight text-[#064E3B]">GetPet</span>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#059669] to-[#34D399] shadow-sm" />
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 pt-6 pb-24">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/80 px-8 py-4 backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg justify-between items-center">
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="h-1 w-5 rounded-full bg-[#059669]" />
              <span className="text-[11px] font-bold uppercase tracking-tighter text-[#059669]">Поиск</span>
            </div>
            <span className="text-[11px] font-medium uppercase tracking-tighter text-gray-400">Избранное</span>
            <span className="text-[11px] font-medium uppercase tracking-tighter text-gray-400">Мои анкеты</span>
          </div>
        </nav>

        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: { 
              borderRadius: '1.5rem', 
              background: '#fff',
              border: '1px solid #F3F4F6',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)' 
            },
          }} 
        />
      </body>
    </html>
  );
}

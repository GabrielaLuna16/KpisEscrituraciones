import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Dashboard KPIs — Escrituración',
  description: 'Monitoreo de KPIs y seguimiento de procesos de escrituración',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${plusJakarta.variable} font-sans bg-[#e7eaf0] text-gray-900 min-h-screen`}>
        <header className="bg-gradient-to-r from-[#1a1f2e] to-[#252d3d] text-white px-8 py-5 border-b border-white/5 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              {/* ATISA wordmark */}
              <span className="font-display text-2xl font-extrabold tracking-widest text-white select-none">
                ATISA
              </span>
              <div className="border-l border-white/20 pl-4">
                <p className="text-[#d36868] text-[10px] font-bold uppercase tracking-widest">Dashboard</p>
                <h1 className="font-display text-lg font-extrabold tracking-tight text-white leading-tight">
                  Escrituración · KPIs
                </h1>
              </div>
            </div>

            <nav className="flex gap-1">
              {[
                { href: '/',       label: 'Dashboard' },
                { href: '/upload', label: 'Cargar datos' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-7 py-6 pb-16">
          {children}
        </main>
      </body>
    </html>
  )
}

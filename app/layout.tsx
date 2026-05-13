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
      <body className={`${dmSans.variable} ${plusJakarta.variable} font-sans bg-gray-100 text-gray-900 min-h-screen`}>
        <header className="bg-gradient-to-br from-slate-800 to-slate-950 text-white px-8 py-7">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xl shrink-0">
                📊
              </div>
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight">Dashboard de Escrituración</h1>
                <p className="text-slate-400 text-sm mt-0.5">Monitoreo de KPIs y seguimiento de procesos</p>
              </div>
            </div>
            <nav className="flex gap-1">
              {[
                { href: '/',          label: 'Dashboard' },
                { href: '/historico', label: 'Histórico' },
                { href: '/upload',    label: 'Cargar datos' },
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

import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
})
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
})

export const metadata: Metadata = {
  title: 'Dashboard KPIs — Escrituración',
  description: 'Monitoreo de KPIs y seguimiento de procesos de escrituración',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} font-sans min-h-screen`}
        style={{ background: 'var(--bg)', color: 'var(--text)' }}
      >
        <header className="bg-[#1a1a1a] text-white relative" style={{ borderBottom: '3px solid var(--red)' }}>
          <div className="max-w-[1600px] mx-auto w-full px-8 py-4 flex items-center justify-between flex-wrap gap-3">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="font-condensed text-[1.35rem] font-bold tracking-[.04em] uppercase">
                  Dashboard de Escrituración
                </h1>
                <p className="text-[.78rem] text-[#888] mt-0.5">
                  Monitoreo de KPIs y seguimiento de procesos
                </p>
              </div>
            </div>

            {/* Nav + badge */}
            <div className="flex items-center gap-2">
              <nav className="flex gap-0.5">
                {[
                  { href: '/',       label: 'Dashboard' },
                  { href: '/upload', label: 'Cargar datos' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-1.5 text-sm font-medium text-[#aaa] hover:text-white hover:bg-white/10 transition-all"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <span
                className="font-condensed text-[.72rem] font-bold tracking-[.1em] uppercase px-3 py-1 text-white"
                style={{ background: 'var(--red)' }}
              >
                KPI Monitor
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto w-full px-7 py-6 pb-16">
          {children}
        </main>
      </body>
    </html>
  )
}

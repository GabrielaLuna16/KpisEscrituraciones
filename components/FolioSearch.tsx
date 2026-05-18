'use client'
import { useState, useRef } from 'react'
import type { EscrituracionRecord } from '@/types'

interface Props {
  data: EscrituracionRecord[]
  value: { folio: string; nombre: string } | null
  onChange: (v: { folio: string; nombre: string } | null) => void
}

export default function FolioSearch({ data, value, onChange }: Props) {
  const [query, setQuery] = useState(value ? `${value.folio} — ${value.nombre}` : '')
  const [open, setOpen]   = useState(false)
  const inputRef          = useRef<HTMLInputElement>(null)

  /** Items shown in dropdown: all when no query, filtered when typing */
  const hits = open && !value
    ? (query
        ? data.filter(d =>
            d.folio.toLowerCase().includes(query.toLowerCase()) ||
            d.nombre.toLowerCase().includes(query.toLowerCase())
          )
        : data)
    : []

  function select(d: EscrituracionRecord) {
    onChange({ folio: d.folio, nombre: d.nombre })
    setQuery(`${d.folio} — ${d.nombre}`)
    setOpen(false)
  }

  function clear() {
    onChange(null)
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-[10px] mb-[14px] flex-wrap">
      <span className="font-condensed text-[.78rem] font-bold tracking-[.06em] uppercase whitespace-nowrap" style={{ color: 'var(--muted)' }}>
        Buscar Folio:
      </span>
      <div className="relative flex-1 min-w-[200px] max-w-[360px]">
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(null); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Seleccionar folio o buscar..."
          className="w-full px-3 py-2 pr-8 text-[.83rem] outline-none transition-all"
          style={{
            border: '1.5px solid var(--border2)',
            fontFamily: 'var(--font-barlow), sans-serif',
            color: 'var(--text)',
            background: '#fff',
          }}
          onFocusCapture={e => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--red)'
            ;(e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(228,30,37,.08)'
          }}
          onBlurCapture={e => {
            (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border2)'
            ;(e.currentTarget as HTMLInputElement).style.boxShadow = 'none'
          }}
        />
        {query && (
          <button
            onMouseDown={e => { e.preventDefault(); clear() }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm bg-transparent border-none cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >✕</button>
        )}
        {hits.length > 0 && (
          <div
            className="absolute top-[calc(100%+2px)] left-0 right-0 bg-white z-50 max-h-[210px] overflow-y-auto"
            style={{ border: '1.5px solid var(--border2)', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
          >
            {hits.map(d => (
              <div
                key={d.folio}
                onMouseDown={() => select(d)}
                className="px-3 py-2 text-[.82rem] cursor-pointer"
                style={{ borderBottom: '1px solid #f0f0f0', fontFamily: 'var(--font-barlow), sans-serif' }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.background = '#fff0f0'
                  ;(e.currentTarget as HTMLDivElement).style.color = 'var(--red)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.background = ''
                  ;(e.currentTarget as HTMLDivElement).style.color = ''
                }}
              >
                <strong>{d.folio}</strong> — {d.nombre}
              </div>
            ))}
          </div>
        )}
        {open && query && !value && hits.length === 0 && (
          <div
            className="absolute top-[calc(100%+2px)] left-0 right-0 bg-white z-50"
            style={{ border: '1.5px solid var(--border2)' }}
          >
            <div className="px-3 py-2 text-[.82rem]" style={{ color: 'var(--muted)' }}>Sin resultados</div>
          </div>
        )}
      </div>
    </div>
  )
}

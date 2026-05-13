'use client'
import { useState, useRef } from 'react'
import type { EscrituracionRecord } from '@/types'

interface Props {
  data: EscrituracionRecord[]
  value: { folio: string; nombre: string } | null
  onChange: (v: { folio: string; nombre: string } | null) => void
}

export default function FolioSearch({ data, value, onChange }: Props) {
  const [query, setQuery]   = useState(value ? `${value.folio} — ${value.nombre}` : '')
  const [open, setOpen]     = useState(false)
  const inputRef            = useRef<HTMLInputElement>(null)

  const hits = query && !value
    ? data.filter(d =>
        d.folio.toLowerCase().includes(query.toLowerCase()) ||
        d.nombre.toLowerCase().includes(query.toLowerCase())
      )
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
    <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
      <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Buscar Folio:</span>
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(null); setOpen(true) }}
          onFocus={() => { if (query && !value) setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Folio o nombre del comprador..."
          className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {query && (
          <button
            onMouseDown={e => { e.preventDefault(); clear() }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
          >✕</button>
        )}
        {open && hits.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto">
            {hits.map(d => (
              <div
                key={d.folio}
                onMouseDown={() => select(d)}
                className="px-3 py-2 text-sm cursor-pointer border-b border-gray-50 last:border-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <strong>{d.folio}</strong> — {d.nombre}
              </div>
            ))}
          </div>
        )}
        {open && query && !hits.length && !value && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <div className="px-3 py-2 text-sm text-gray-400">Sin resultados</div>
          </div>
        )}
      </div>
    </div>
  )
}

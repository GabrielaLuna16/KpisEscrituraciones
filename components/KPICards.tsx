'use client'
import { useState } from 'react'
import type { EscrituracionRecord } from '@/types'

function Modal({ title, records, onClose }: {
  title: string
  records: EscrituracionRecord[]
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl p-7 max-w-2xl w-11/12 max-h-[82vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-base font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {['Comprador','Folio','Etapa','Estatus'].map(h => (
                <th key={h} className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2">{r.nombre}</td>
                <td className="px-3 py-2">{r.folio}</td>
                <td className="px-3 py-2 text-xs">{r.etapa}</td>
                <td className="px-3 py-2">
                  <span className={[
                    'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                    r.estatus === 'En proceso'  ? 'bg-amber-100 text-amber-800'   :
                    r.estatus === 'Detenido'    ? 'bg-red-100 text-red-800'       :
                                                  'bg-emerald-100 text-emerald-800',
                  ].join(' ')}>{r.estatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function KPICards({ data }: { data: EscrituracionRecord[] }) {
  const [modal, setModal] = useState<{ title: string; records: EscrituracionRecord[] } | null>(null)

  const cards = [
    { accent: 'border-l-blue-600',    value: 'text-blue-600',    label: 'Total Solicitudes', sub: 'Todas las solicitudes',  records: data },
    { accent: 'border-l-amber-500',   value: 'text-amber-500',   label: 'En Proceso',        sub: 'Solicitudes activas',    records: data.filter(d => d.estatus === 'En proceso') },
    { accent: 'border-l-red-600',     value: 'text-red-600',     label: 'Detenidas',         sub: 'Requieren atención',     records: data.filter(d => d.estatus === 'Detenido') },
    { accent: 'border-l-emerald-600', value: 'text-emerald-600', label: 'Completadas',       sub: 'Proceso finalizado',     records: data.filter(d => d.estatus === 'Completado') },
  ]

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {cards.map(c => (
          <button
            key={c.label}
            onClick={() => setModal({ title: `${c.label} (${c.records.length})`, records: c.records })}
            className={`bg-white rounded-2xl p-5 shadow-sm border-2 border-transparent border-l-4 ${c.accent} text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer`}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</div>
            <div className={`font-display text-3xl font-extrabold mt-1.5 mb-0.5 ${c.value}`}>{c.records.length}</div>
            <div className="text-xs text-gray-400">{c.sub}</div>
          </button>
        ))}
      </div>
      {modal && <Modal title={modal.title} records={modal.records} onClose={() => setModal(null)} />}
    </>
  )
}

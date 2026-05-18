'use client'
import { useState } from 'react'
import type { EscrituracionRecord } from '@/types'
import Modal from '@/components/Modal'

const CARDS = [
  { barColor: '#e41e25', valueColor: '#e41e25', label: 'Total Solicitudes', sub: 'Todas las solicitudes',  filter: null },
  { barColor: '#c77d00', valueColor: '#c77d00', label: 'En Proceso',        sub: 'Solicitudes activas',    filter: 'En proceso'  as const },
  { barColor: '#e05c14', valueColor: '#e05c14', label: 'Detenidas',         sub: 'Requieren atención',     filter: 'Detenido'    as const },
  { barColor: '#1e8c4e', valueColor: '#1e8c4e', label: 'Completadas',       sub: 'Proceso finalizado',     filter: 'Completado'  as const },
]

export default function KPICards({ data }: { data: EscrituracionRecord[] }) {
  const [modal, setModal] = useState<{ title: string; records: EscrituracionRecord[] } | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {CARDS.map(c => {
          const records = c.filter ? data.filter(d => d.estatus === c.filter) : data
          return (
            <button
              key={c.label}
              onClick={() => setModal({ title: `${c.label} (${records.length})`, records })}
              className="bg-white text-left cursor-pointer hover:-translate-y-0.5 transition-all overflow-hidden"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)', border: 'none' }}
            >
              <div style={{ height: '3px', background: c.barColor }} />
              <div className="px-5 pt-[18px] pb-4">
                <div className="font-condensed text-[.75rem] font-semibold uppercase tracking-[.1em]" style={{ color: 'var(--muted)' }}>
                  {c.label}
                </div>
                <div
                  className="font-condensed text-[2.4rem] font-extrabold mt-1 mb-0.5 leading-none"
                  style={{ color: c.valueColor }}
                >
                  {records.length}
                </div>
                <div className="text-[.73rem]" style={{ color: 'var(--muted)' }}>{c.sub}</div>
              </div>
            </button>
          )
        })}
      </div>

      {modal && (
        <Modal title={modal.title} records={modal.records} onClose={() => setModal(null)} />
      )}
    </>
  )
}

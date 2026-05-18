'use client'
import type { EscrituracionRecord } from '@/types'

interface Props {
  title: string
  records: EscrituracionRecord[]
  onClose: () => void
}

export default function Modal({ title, records, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white max-w-[720px] w-[90%] max-h-[82vh] overflow-y-auto"
        style={{ borderTop: '4px solid var(--red)', boxShadow: '0 20px 60px rgba(0,0,0,.25)' }}
      >
        <div className="px-7 pt-7 pb-3 flex justify-between items-center">
          <h3 className="font-condensed text-[1.1rem] font-bold tracking-[.06em] uppercase">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#717171] hover:text-[var(--red)] text-2xl leading-none bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="px-7 pb-7">
          <table className="w-full border-collapse text-[.82rem]">
            <thead>
              <tr>
                {['Comprador', 'Folio', 'Etapa', 'Estatus'].map(h => (
                  <th
                    key={h}
                    className="px-3 py-[9px] text-left font-condensed font-bold text-[#717171] text-[.72rem] uppercase tracking-[.06em]"
                    style={{ background: '#f5f5f5', borderBottom: '2px solid var(--red)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-3 py-[9px]">{r.nombre}</td>
                  <td className="px-3 py-[9px]">{r.folio}</td>
                  <td className="px-3 py-[9px] text-xs">{r.etapa}</td>
                  <td className="px-3 py-[9px]">
                    <span
                      className="inline-block px-2 py-0.5 text-[.71rem] font-bold font-condensed tracking-[.05em] uppercase"
                      style={
                        r.estatus === 'En proceso'
                          ? { background: '#fff3cd', color: '#7a4e00' }
                          : r.estatus === 'Detenido'
                          ? { background: '#fde8e8', color: '#8b0000' }
                          : { background: '#d4edda', color: '#155724' }
                      }
                    >
                      {r.estatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

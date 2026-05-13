'use client'
import '@/lib/chartSetup'
import { useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import type { EscrituracionRecord } from '@/types'
import { STAGE_KEYS, KPI_LIMITS } from '@/lib/constants'
import { median } from '@/lib/dataHelpers'

interface Summary {
  month: string
  label: string
  total: number
  enProceso: number
  detenidos: number
  completados: number
}

interface Props {
  months: string[]
  summaries: Summary[]
  allData: Record<string, EscrituracionRecord[]>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-lg font-bold mb-3.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
        {title}
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm">{children}</div>
    </section>
  )
}

export default function HistoricoClient({ months, summaries, allData }: Props) {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(months.slice(-3))

  function toggleMonth(m: string) {
    setSelectedMonths(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m].sort()
    )
  }

  const filtered = selectedMonths.length ? selectedMonths : months

  return (
    <>
      {/* Selector de meses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-7">
        <p className="text-sm font-semibold text-gray-400 mb-3">Selecciona los meses a comparar:</p>
        <div className="flex gap-1.5 flex-wrap">
          {months.map(m => (
            <button
              key={m}
              onClick={() => toggleMonth(m)}
              className={[
                'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                selectedMonths.includes(m)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-blue-500 hover:text-blue-600',
              ].join(' ')}
            >{summaries.find(s => s.month === m)?.label}</button>
          ))}
        </div>
      </div>

      {/* Tabla resumen */}
      <Section title="Resumen por Mes">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {['Mes','Total','En Proceso','Detenidos','Completados','% Completado'].map(h => (
                  <th key={h} className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaries.filter(s => filtered.includes(s.month)).map(s => (
                <tr key={s.month} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 font-semibold">{s.label}</td>
                  <td className="px-3 py-2">{s.total}</td>
                  <td className="px-3 py-2 text-amber-600 font-medium">{s.enProceso}</td>
                  <td className="px-3 py-2 text-red-600 font-medium">{s.detenidos}</td>
                  <td className="px-3 py-2 text-emerald-600 font-medium">{s.completados}</td>
                  <td className="px-3 py-2">{s.total ? Math.round(s.completados / s.total * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Evolución de estatus */}
      <Section title="Evolución de Estatus por Mes">
        <Line
          data={{
            labels: filtered.map(m => summaries.find(s => s.month === m)?.label ?? m),
            datasets: [
              { label: 'En Proceso',  data: filtered.map(m => summaries.find(s => s.month === m)?.enProceso  ?? 0), borderColor: '#d97706', backgroundColor: 'rgba(217,119,6,.08)', fill: true, tension: 0.35, pointRadius: 5 },
              { label: 'Detenidos',   data: filtered.map(m => summaries.find(s => s.month === m)?.detenidos  ?? 0), borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,.08)', fill: true, tension: 0.35, pointRadius: 5 },
              { label: 'Completados', data: filtered.map(m => summaries.find(s => s.month === m)?.completados ?? 0), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,.08)', fill: true, tension: 0.35, pointRadius: 5 },
            ],
          }}
          options={{
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } },
          }}
        />
      </Section>

      {/* Tiempo promedio por etapa comparado entre meses */}
      <Section title="Tiempo Promedio por Etapa — Comparativa">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-200 sticky left-0">Etapa</th>
                <th className="bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-red-400 uppercase tracking-wide border-b-2 border-gray-200">KPI</th>
                {filtered.map(m => (
                  <th key={m} className="bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide border-b-2 border-gray-200">
                    {summaries.find(s => s.month === m)?.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAGE_KEYS.map(stage => {
                const kpi = KPI_LIMITS[stage.key as string] ?? '—'
                return (
                  <tr key={stage.key as string} className="border-b border-gray-50 last:border-0">
                    <td className="px-3 py-2 text-xs sticky left-0 bg-white">{stage.short}</td>
                    <td className="px-3 py-2 text-center text-xs font-semibold text-red-500">{kpi}</td>
                    {filtered.map(m => {
                      const vals = (allData[m] ?? [])
                        .map(d => d[stage.key as keyof EscrituracionRecord])
                        .filter((v): v is number => typeof v === 'number')
                      const med = median(vals)
                      const over = med != null && typeof kpi === 'number' && med > kpi
                      return (
                        <td key={m} className={`px-3 py-2 text-center text-xs font-medium ${over ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                          {med != null ? med.toFixed(1) : '—'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">Valores en días (mediana). Rojo = supera KPI límite.</p>
      </Section>

      {/* Tendencia tiempo promedio total */}
      <Section title="Tendencia Tiempo Total Promedio">
        <Bar
          data={{
            labels: filtered.map(m => summaries.find(s => s.month === m)?.label ?? m),
            datasets: [{
              label: 'Días promedio total por registro',
              data: filtered.map(m => {
                const d = allData[m] ?? []
                const totals = d.map(r =>
                  STAGE_KEYS.reduce((acc, s) => {
                    const v = r[s.key as keyof EscrituracionRecord]
                    return acc + (typeof v === 'number' && v > 0 ? v : 0)
                  }, 0)
                ).filter(t => t > 0)
                const med = median(totals)
                return med != null ? +med.toFixed(1) : null
              }),
              backgroundColor: 'rgba(37,99,235,.7)',
              borderColor: '#2563eb',
              borderWidth: 2,
              borderRadius: 8,
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Días (mediana)' } }, x: { grid: { display: false } } },
          }}
        />
      </Section>
    </>
  )
}

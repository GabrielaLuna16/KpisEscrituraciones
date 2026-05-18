'use client'
import '@/lib/chartSetup'
import { Line } from 'react-chartjs-2'
import { useState, useMemo } from 'react'
import type { EscrituracionRecord } from '@/types'
import { STAGE_KEYS, LINE_PALETTE, KPI_LIMITS } from '@/lib/constants'
import DeptTabs from '@/components/DeptTabs'

export default function TiempoCierreChart({ data }: { data: EscrituracionRecord[] }) {
  const allDepts = [...new Set(STAGE_KEYS.map(s => s.dept))]
  const [activeDept, setActiveDept] = useState('Todos')
  const [selFolioKey, setSelFolioKey] = useState<string>('')

  const stages = activeDept === 'Todos' ? STAGE_KEYS : STAGE_KEYS.filter(s => s.dept === activeDept)
  const recs   = selFolioKey ? data.filter(d => d.folio === selFolioKey) : data

  const chartData = useMemo(() => {
    const pad   = stages.length === 1 ? 2 : 0
    const empty = Array(pad).fill(null)
    const labels = [...Array(pad).fill(''), ...stages.map(s => s.short), ...Array(pad).fill('')]

    const padVals = (vals: (number | null)[]) => [...empty, ...vals, ...empty]

    const datasets: object[] = []

    // KPI reference line
    const kv = stages.map(s => KPI_LIMITS[s.key as string] ?? null)
    if (kv.some(v => v != null)) {
      datasets.push({
        label: 'KPI Límite',
        data: padVals(kv),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        borderDash: [7, 4],
        pointRadius: 3,
        tension: 0,
        fill: false,
        order: 0,
      })
    }

    // One line per record — low opacity
    recs.forEach((d, i) => {
      const vals = stages.map(s => {
        const v = d[s.key as keyof EscrituracionRecord]
        return typeof v === 'number' ? v : null
      })
      if (vals.every(v => v == null)) return
      const col = LINE_PALETTE[i % LINE_PALETTE.length]
      datasets.push({
        label: `#${d.folio} — ${d.nombre}`,
        data: padVals(vals),
        borderColor: col,
        backgroundColor: col + '0d',   // ~5% opacity fill
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 1.5,
        order: 1,
      })
    })

    return { labels, datasets }
  }, [stages, recs])

  return (
    <div>
      {/* Dropdown selector — replaces chart legend */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
          Registro:
        </label>
        <select
          value={selFolioKey}
          onChange={e => setSelFolioKey(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-[#d36868] focus:ring-2 focus:ring-[#d36868]/20 max-w-xs"
        >
          <option value="">Todos los registros ({data.length})</option>
          {data.map(d => (
            <option key={d.folio} value={d.folio}>
              #{d.folio} — {d.nombre}
            </option>
          ))}
        </select>
      </div>

      <DeptTabs depts={allDepts} active={activeDept} onChange={setActiveDept} />

      <Line
        data={chartData as never}
        options={{
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const v = ctx.parsed.y
                  if (v == null) return ''
                  return `${ctx.dataset.label}: ${v} días`
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Días' },
              grid: { color: '#f0f0f0' },
            },
            x: {
              grid: { display: false },
              ticks: {
                maxRotation: 40,
                minRotation: 20,
                font: { size: 10 },
                callback(val, idx) {
                  const lbl = this.getLabelForValue(idx as number)
                  return lbl === '' ? '' : lbl
                },
              },
            },
          },
        }}
        style={{ maxHeight: 430 }}
      />
      <p className="text-xs text-gray-400 mt-2.5 italic">
        Cada línea coloreada representa un folio/registro. La línea roja discontinua es el KPI límite de días.
      </p>
    </div>
  )
}

'use client'
import '@/lib/chartSetup'
import { Line } from 'react-chartjs-2'
import { useState, useMemo } from 'react'
import type { EscrituracionRecord } from '@/types'
import { STAGE_KEYS, LINE_PALETTE, KPI_LIMITS } from '@/lib/constants'
import FolioSearch from '@/components/FolioSearch'
import DeptTabs from '@/components/DeptTabs'

export default function TiempoCierreChart({ data }: { data: EscrituracionRecord[] }) {
  const allDepts = [...new Set(STAGE_KEYS.map(s => s.dept))]
  const [activeDept, setActiveDept] = useState('Todos')
  const [selFolio, setSelFolio] = useState<{ folio: string; nombre: string } | null>(null)

  const stages = activeDept === 'Todos' ? STAGE_KEYS : STAGE_KEYS.filter(s => s.dept === activeDept)
  const recs   = selFolio ? data.filter(d => d.folio === selFolio.folio) : data

  const chartData = useMemo(() => {
    const pad = stages.length === 1 ? 2 : 0
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

    // One line per record
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
        backgroundColor: col + '18',
        fill: false, tension: 0.3,
        pointRadius: 4, pointHoverRadius: 7,
        borderWidth: 2, order: 1,
      })
    })

    return { labels, datasets }
  }, [stages, recs])

  return (
    <div>
      <FolioSearch data={data} value={selFolio} onChange={setSelFolio} />
      <DeptTabs depts={allDepts} active={activeDept} onChange={setActiveDept} />
      <Line
        data={chartData as never}
        options={{
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 12, font: { size: 10 }, padding: 10, usePointStyle: true },
            },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Días' }, grid: { color: '#f0f0f0' } },
            x: {
              grid: { display: false },
              ticks: {
                maxRotation: 40, minRotation: 20, font: { size: 10 },
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

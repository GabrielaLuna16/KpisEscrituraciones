'use client'
import '@/lib/chartSetup'
import { Bar } from 'react-chartjs-2'
import { useState, useMemo } from 'react'
import type { EscrituracionRecord } from '@/types'
import { STAGE_KEYS, KPI_LIMITS } from '@/lib/constants'
import { median } from '@/lib/dataHelpers'
import FolioSearch from '@/components/FolioSearch'
import DeptTabs   from '@/components/DeptTabs'

export default function PromedioChart({ data }: { data: EscrituracionRecord[] }) {
  const allDepts = [...new Set(STAGE_KEYS.map(s => s.dept))]
  const [activeDept, setActiveDept] = useState('Todos')
  const [selFolio, setSelFolio]     = useState<{ folio: string; nombre: string } | null>(null)

  const stages = activeDept === 'Todos' ? STAGE_KEYS : STAGE_KEYS.filter(s => s.dept === activeDept)

  const chartData = useMemo(() => {
    const labels = stages.map(s => s.short)
    const kv     = stages.map(s => KPI_LIMITS[s.key as string] ?? null)
    let medVals: (number | null)[]

    if (selFolio) {
      const r = data.find(d => d.folio === selFolio.folio)
      medVals = stages.map(s => {
        const v = r?.[s.key as keyof EscrituracionRecord]
        return typeof v === 'number' ? v : null
      })
    } else {
      medVals = stages.map(s => {
        const vals = data.map(d => d[s.key as keyof EscrituracionRecord]).filter((v): v is number => typeof v === 'number')
        const m    = median(vals)
        return m != null ? +m.toFixed(1) : null
      })
    }

    return {
      labels,
      datasets: [
        {
          label: 'KPI Límite',
          data: kv,
          backgroundColor: 'rgba(26,26,26,.12)',
          borderColor: '#1a1a1a',
          borderWidth: 2,
          borderRadius: 2,
          order: 2,
        },
        {
          label: selFolio ? `Días reales — ${selFolio.folio}` : 'Mediana días reales',
          data: medVals,
          backgroundColor: 'rgba(228,30,37,.75)',
          borderColor: '#e41e25',
          borderWidth: 2,
          borderRadius: 6,
          order: 1,
        },
      ],
    }
  }, [stages, selFolio, data])

  return (
    <div>
      <FolioSearch data={data} value={selFolio} onChange={setSelFolio} />
      <DeptTabs depts={allDepts} active={activeDept} onChange={setActiveDept} />
      <Bar
        data={chartData}
        options={{
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 14, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const v = ctx.parsed.y
                  return `${ctx.dataset.label}: ${v != null ? v + ' días' : 'Sin datos'}`
                },
                afterBody(items) {
                  const s    = stages[items[0].dataIndex]
                  const vals = data.map(d => d[s.key as keyof EscrituracionRecord]).filter((v): v is number => typeof v === 'number')
                  if (!vals.length) return ''
                  return `\nMín: ${Math.min(...vals)} días  |  Máx: ${Math.max(...vals)} días  |  n=${vals.length}`
                },
              },
            },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Días' }, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false }, ticks: { maxRotation: 40, minRotation: 20, font: { size: 10 } } },
          },
        }}
      />
    </div>
  )
}

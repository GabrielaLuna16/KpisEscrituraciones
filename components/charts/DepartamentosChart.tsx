'use client'
import '@/lib/chartSetup'
import { Bar } from 'react-chartjs-2'
import type { EscrituracionRecord } from '@/types'
import { getDept } from '@/lib/dataHelpers'
import { DEPT_COLORS } from '@/lib/constants'

export default function DepartamentosChart({ data }: { data: EscrituracionRecord[] }) {
  const fil = data.filter(d => d.estatus !== 'Completado')
  const cnt: Record<string, number> = {}
  fil.forEach(d => { const dep = getDept(d.etapa); cnt[dep] = (cnt[dep] ?? 0) + 1 })
  const depts = Object.keys(cnt)

  return (
    <Bar
      data={{
        labels: depts,
        datasets: [{
          label: 'Procesos',
          data: depts.map(d => cnt[d]),
          backgroundColor: depts.map(d => DEPT_COLORS[d] ?? '#6b7280'),
          borderRadius: 8,
          maxBarThickness: 64,
        }],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } },
        },
      }}
    />
  )
}

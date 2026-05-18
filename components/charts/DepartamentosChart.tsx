'use client'
import '@/lib/chartSetup'
import { Bar } from 'react-chartjs-2'
import type { Plugin } from 'chart.js'
import type { EscrituracionRecord } from '@/types'
import { getDept } from '@/lib/dataHelpers'
import { DEPT_COLORS } from '@/lib/constants'

/** Draws value labels on top of each bar */
const topLabelsPlugin: Plugin<'bar'> = {
  id: 'topLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)
    meta.data.forEach((bar, i) => {
      const value = chart.data.datasets[0].data[i] as number
      if (!value) return
      ctx.save()
      ctx.fillStyle = '#374151'
      ctx.font = '600 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(String(value), bar.x, bar.y - 4)
      ctx.restore()
    })
  },
}

export default function DepartamentosChart({ data }: { data: EscrituracionRecord[] }) {
  const fil = data.filter(d => d.estatus !== 'Completado')
  const cnt: Record<string, number> = {}
  fil.forEach(d => { const dep = getDept(d.etapa); cnt[dep] = (cnt[dep] ?? 0) + 1 })
  const depts = Object.keys(cnt)

  return (
    <Bar
      plugins={[topLabelsPlugin]}
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
        layout: { padding: { top: 22 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: ctx => ctx[0].label,
              label: ctx => `${ctx.parsed.y} proceso${ctx.parsed.y !== 1 ? 's' : ''}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } },
        },
      }}
    />
  )
}

'use client'
import '@/lib/chartSetup'
import { Bar } from 'react-chartjs-2'
import { useState } from 'react'
import type { Plugin } from 'chart.js'
import type { EscrituracionRecord } from '@/types'
import { getDept } from '@/lib/dataHelpers'
import { DEPT_COLORS } from '@/lib/constants'
import Modal from '@/components/Modal'

/** Dibuja el valor encima de cada barra */
const topLabelsPlugin: Plugin<'bar'> = {
  id: 'topLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)
    meta.data.forEach((bar, i) => {
      const value = chart.data.datasets[0].data[i] as number
      if (!value) return
      ctx.save()
      ctx.fillStyle = '#1a1a1a'
      ctx.font = '800 14px "Barlow Condensed", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(String(value), bar.x, bar.y - 6)
      ctx.restore()
    })
  },
}

export default function DepartamentosChart({ data }: { data: EscrituracionRecord[] }) {
  const [modal, setModal] = useState<{ title: string; records: EscrituracionRecord[] } | null>(null)

  const fil   = data.filter(d => d.estatus !== 'Completado')
  const cnt: Record<string, number> = {}
  fil.forEach(d => { const dep = getDept(d.etapa); cnt[dep] = (cnt[dep] ?? 0) + 1 })
  const depts = Object.keys(cnt)

  function handleClick(_e: unknown, els: { index: number }[]) {
    if (!els.length) return
    const dept    = depts[els[0].index]
    const records = fil.filter(d => getDept(d.etapa) === dept)
    setModal({ title: `Departamento: ${dept}`, records })
  }

  return (
    <>
      <Bar
        plugins={[topLabelsPlugin]}
        data={{
          labels: depts,
          datasets: [{
            label: 'Procesos',
            data: depts.map(d => cnt[d]),
            backgroundColor: depts.map(d => DEPT_COLORS[d] ?? '#6b7280'),
            borderRadius: 2,
            maxBarThickness: 64,
          }],
        }}
        options={{
          responsive: true,
          layout: { padding: { top: 28 } },
          onClick: handleClick as never,
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
      {modal && <Modal title={modal.title} records={modal.records} onClose={() => setModal(null)} />}
    </>
  )
}

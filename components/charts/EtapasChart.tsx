'use client'
import '@/lib/chartSetup'
import { Line } from 'react-chartjs-2'
import type { EscrituracionRecord } from '@/types'
import { ETAPAS_ORDER } from '@/lib/constants'

export default function EtapasChart({ data }: { data: EscrituracionRecord[] }) {
  const fil = data.filter(d => d.estatus !== 'Completado')
  const cnt: Record<string, number> = {}
  ETAPAS_ORDER.forEach(e => { cnt[e] = 0 })
  fil.forEach(d => { if (cnt[d.etapa] !== undefined) cnt[d.etapa]++ })

  const labels = ETAPAS_ORDER.map(e => {
    const parts = e.split('/')
    return parts[1] ? parts[1].trim() : parts[0].trim()
  })

  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: 'Solicitudes',
          data: ETAPAS_ORDER.map(e => cnt[e]),
          borderColor: '#e41e25',
          backgroundColor: 'rgba(228,30,37,.05)',
          fill: true, tension: 0.3, pointRadius: 5, pointHoverRadius: 8,
          pointBackgroundColor: '#e41e25',
        }],
      }}
      options={{
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: items => ETAPAS_ORDER[items[0].dataIndex],
              label: ctx => `${ctx.parsed.y} solicitud${ctx.parsed.y !== 1 ? 'es' : ''}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 25, font: { size: 10 } } },
        },
      }}
    />
  )
}

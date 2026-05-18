'use client'
import '@/lib/chartSetup'
import { Line } from 'react-chartjs-2'
import type { EscrituracionRecord } from '@/types'
import { getMonthKey, monthLabel } from '@/lib/dataHelpers'

export default function SolicitudesChart({ data }: { data: EscrituracionRecord[] }) {
  const monthSet = new Set<string>()
  data.forEach(d => {
    const mk = getMonthKey(d.created)
    if (mk) monthSet.add(mk)
    if (d.cierre) {
      const ck = getMonthKey(d.cierre)
      if (ck) monthSet.add(ck)
    }
  })
  const months = [...monthSet].sort()

  const inProcArr = months.map(mk => {
    let ip = 0
    data.forEach(d => {
      const cm = getMonthKey(d.created)
      if (cm && cm <= mk) {
        if (!d.baja) ip++
        else if (d.cierre && getMonthKey(d.cierre)! > mk) ip++
      }
    })
    return ip
  })

  const compArr = months.map(mk =>
    data.filter(d => d.baja && d.cierre && getMonthKey(d.cierre) === mk).length
  )

  return (
    <Line
      data={{
        labels: months.map(monthLabel),
        datasets: [
          {
            label: 'En Proceso (acumulado)',
            data: inProcArr,
            borderColor: '#d97706',
            backgroundColor: 'rgba(217,119,6,.08)',
            fill: true, tension: 0.35, pointRadius: 5, pointHoverRadius: 9,
            pointBackgroundColor: '#d97706',
          },
          {
            label: 'Completadas',
            data: compArr,
            borderColor: '#059669',
            backgroundColor: 'rgba(5,150,105,.08)',
            fill: true, tension: 0.35, pointRadius: 5, pointHoverRadius: 9,
            pointBackgroundColor: '#059669',
          },
        ],
      }}
      options={{
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 14 } },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} solicitudes`,
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

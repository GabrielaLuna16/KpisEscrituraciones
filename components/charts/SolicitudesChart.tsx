'use client'
import '@/lib/chartSetup'
import { Line } from 'react-chartjs-2'
import { useState } from 'react'
import type { EscrituracionRecord } from '@/types'
import { getMonthKey, monthLabel } from '@/lib/dataHelpers'
import Modal from '@/components/Modal'

export default function SolicitudesChart({ data }: { data: EscrituracionRecord[] }) {
  const [modal, setModal] = useState<{ title: string; records: EscrituracionRecord[] } | null>(null)

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

  function handleClick(_e: unknown, els: { index: number }[]) {
    if (!els.length) return
    const mk = months[els[0].index]
    const records = data.filter(d => {
      const cm = getMonthKey(d.created)
      if (!cm || cm > mk) return false
      if (!d.baja) return true
      if (d.cierre && getMonthKey(d.cierre)! >= mk) return true
      return false
    })
    setModal({ title: `Solicitudes — ${monthLabel(mk)}`, records })
  }

  return (
    <>
      <Line
        data={{
          labels: months.map(monthLabel),
          datasets: [
            {
              label: 'En Proceso (acumulado)',
              data: inProcArr,
              borderColor: '#e41e25',
              backgroundColor: 'rgba(228,30,37,.06)',
              fill: true, tension: 0.35, pointRadius: 5, pointHoverRadius: 9,
              pointBackgroundColor: '#e41e25',
            },
            {
              label: 'Completadas',
              data: compArr,
              borderColor: '#1e7c4e',
              backgroundColor: 'rgba(30,124,78,.07)',
              fill: true, tension: 0.35, pointRadius: 5, pointHoverRadius: 9,
              pointBackgroundColor: '#1e7c4e',
            },
          ],
        }}
        options={{
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          onClick: handleClick as never,
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
      {modal && <Modal title={modal.title} records={modal.records} onClose={() => setModal(null)} />}
    </>
  )
}

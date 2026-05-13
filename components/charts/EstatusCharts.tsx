'use client'
import '@/lib/chartSetup'
import { Bar, Doughnut } from 'react-chartjs-2'
import type { EscrituracionRecord } from '@/types'
import { DEPT_COLORS } from '@/lib/constants'

export default function EstatusCharts({ data }: { data: EscrituracionRecord[] }) {
  const statuses = ['En proceso', 'Detenido', 'Completado'] as const

  // Conteos de motivos y áreas (solo Detenidos)
  const det = data.filter(d => d.estatus === 'Detenido')
  const mc: Record<string, number> = {}
  const ac: Record<string, number> = {}
  det.forEach(d => {
    if (d.motivo) mc[d.motivo] = (mc[d.motivo] ?? 0) + 1
    if (d.area)   ac[d.area]   = (ac[d.area]   ?? 0) + 1
  })
  const motivos = Object.keys(mc)
  const areas   = Object.keys(ac)

  return (
    <div className="space-y-6">
      {/* Barra horizontal estatus */}
      <div style={{ maxHeight: 200 }}>
        <Bar
          data={{
            labels: statuses,
            datasets: [{
              data: statuses.map(s => data.filter(d => d.estatus === s).length),
              backgroundColor: ['#d97706','#dc2626','#059669'],
              borderRadius: 8,
              maxBarThickness: 48,
            }],
          }}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Estatus General', font: { size: 13, weight: 'bold' } },
            },
            scales: {
              x: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
              y: { grid: { display: false } },
            },
          }}
        />
      </div>

      {/* Donuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {motivos.length > 0 && (
          <div style={{ maxHeight: 280 }}>
            <Doughnut
              data={{
                labels: motivos,
                datasets: [{
                  data: motivos.map(m => mc[m]),
                  backgroundColor: ['#d97706','#dc2626','#7c3aed','#0891b2','#059669'],
                  borderWidth: 2,
                  borderColor: '#fff',
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: 'Motivo de Detención', font: { size: 13, weight: 'bold' } },
                  legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 11 } } },
                },
              }}
            />
          </div>
        )}
        {areas.length > 0 && (
          <div style={{ maxHeight: 280 }}>
            <Doughnut
              data={{
                labels: areas,
                datasets: [{
                  data: areas.map(a => ac[a]),
                  backgroundColor: areas.map(a => DEPT_COLORS[a] ?? '#6b7280'),
                  borderWidth: 2,
                  borderColor: '#fff',
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  title: { display: true, text: 'Área de Detención', font: { size: 13, weight: 'bold' } },
                  legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 11 } } },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

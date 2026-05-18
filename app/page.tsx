import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { EscrituracionRecord } from '@/types'
import { monthLabel } from '@/lib/dataHelpers'
import KPICards from '@/components/KPICards'
import SolicitudesChart from '@/components/charts/SolicitudesChart'
import DepartamentosChart from '@/components/charts/DepartamentosChart'
import EtapasChart from '@/components/charts/EtapasChart'
import EstatusCharts from '@/components/charts/EstatusCharts'
import TiempoCierreChart from '@/components/charts/TiempoCierreChart'
import PromedioChart from '@/components/charts/PromedioChart'

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), 'public', 'data')

function getMonths(): string[] {
  const p = join(DATA_DIR, 'index.json')
  if (!existsSync(p)) return []
  return (JSON.parse(readFileSync(p, 'utf-8')).months as string[]).sort()
}

function getData(month: string): EscrituracionRecord[] {
  const p = join(DATA_DIR, `${month}.json`)
  if (!existsSync(p)) return []
  return JSON.parse(readFileSync(p, 'utf-8'))
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-lg font-bold mb-3.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: '#d36868' }} />
        {title}
        {note && <span className="text-sm font-normal text-gray-400">{note}</span>}
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm">{children}</div>
    </section>
  )
}

export default function DashboardPage() {
  const months = getMonths()
  const latest = months[months.length - 1]
  const data   = getData(latest ?? '')

  if (!months.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">📂</p>
        <p className="text-lg font-semibold">Aún no hay datos cargados</p>
        <p className="text-sm mt-1">
          Sube el primer reporte en{' '}
          <a href="/upload" className="underline font-medium" style={{ color: '#d36868' }}>
            Cargar datos
          </a>.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <span className="text-sm text-gray-500 font-medium bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
          {monthLabel(latest)} · {data.length} registros
        </span>
      </div>

      <KPICards data={data} />

      <Section title="Solicitudes en Proceso vs Completadas por Mes">
        <SolicitudesChart data={data} />
      </Section>

      <Section title="Procesos por Departamento" note="(excluye Completados)">
        <DepartamentosChart data={data} />
      </Section>

      <Section title="Solicitudes por Etapa del Proceso" note="(excluye Completados)">
        <EtapasChart data={data} />
      </Section>

      <Section title="Estatus de Proceso">
        <EstatusCharts data={data} />
      </Section>

      <Section title="Tiempo de Cierre por Etapa">
        <TiempoCierreChart data={data} />
      </Section>

      <Section title="Tiempo Promedio de Cierre vs KPI">
        <PromedioChart data={data} />
      </Section>
    </>
  )
}

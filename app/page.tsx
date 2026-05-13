import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { EscrituracionRecord } from '@/types'
import { monthLabel } from '@/lib/dataHelpers'
import MonthSelector from '@/components/MonthSelector'
import KPICards from '@/components/KPICards'
import SolicitudesChart from '@/components/charts/SolicitudesChart'
import DepartamentosChart from '@/components/charts/DepartamentosChart'
import EtapasChart from '@/components/charts/EtapasChart'
import EstatusCharts from '@/components/charts/EstatusCharts'
import TiempoCierreChart from '@/components/charts/TiempoCierreChart'
import PromedioChart from '@/components/charts/PromedioChart'

function getMonths(): string[] {
  const p = join(process.cwd(), 'public', 'data', 'index.json')
  if (!existsSync(p)) return []
  return (JSON.parse(readFileSync(p, 'utf-8')).months as string[]).sort()
}

function getData(month: string): EscrituracionRecord[] {
  const p = join(process.cwd(), 'public', 'data', `${month}.json`)
  if (!existsSync(p)) return []
  return JSON.parse(readFileSync(p, 'utf-8'))
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-lg font-bold mb-3.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
        {title}
        {note && <span className="text-sm font-normal text-gray-400">{note}</span>}
      </h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm">{children}</div>
    </section>
  )
}

export default function DashboardPage({ searchParams }: { searchParams: { month?: string } }) {
  const months  = getMonths()
  const latest  = months[months.length - 1]
  const selected = searchParams.month ?? latest
  const data    = getData(selected)

  if (!months.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">📂</p>
        <p className="text-lg font-semibold">Aún no hay datos cargados</p>
        <p className="text-sm mt-1">Sube el primer reporte en <a href="/upload" className="text-blue-600 underline">Cargar datos</a>.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <MonthSelector months={months} selected={selected} />
        <span className="text-sm text-gray-400 font-medium">
          {monthLabel(selected)} · {data.length} registros
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

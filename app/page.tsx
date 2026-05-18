import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { EscrituracionRecord } from '@/types'
import { monthLabel } from '@/lib/dataHelpers'
import TooltipIcon       from '@/components/TooltipIcon'
import KPICards          from '@/components/KPICards'
import SolicitudesChart  from '@/components/charts/SolicitudesChart'
import DepartamentosChart from '@/components/charts/DepartamentosChart'
import EtapasChart       from '@/components/charts/EtapasChart'
import EstatusCharts     from '@/components/charts/EstatusCharts'
import TiempoCierreChart from '@/components/charts/TiempoCierreChart'
import PromedioChart     from '@/components/charts/PromedioChart'

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

/** Sección con barra roja vertical, tipografía condensada y card plana */
function Section({
  title, note, tip, children,
}: {
  title: string; note?: string; tip?: string; children: React.ReactNode
}) {
  return (
    <section className="mb-7">
      <h2 className="font-condensed text-[1.05rem] font-bold tracking-[.08em] uppercase mb-[14px] flex items-center gap-[10px]" style={{ color: 'var(--text)' }}>
        <span className="w-[3px] h-[22px] rounded-[1px] shrink-0" style={{ background: 'var(--red)' }} />
        {title}
        {note && (
          <span className="text-[.75rem] font-medium normal-case tracking-normal ml-0.5" style={{ color: 'var(--muted)' }}>
            {note}
          </span>
        )}
        {tip && <TooltipIcon text={tip} />}
      </h2>
      <div
        className="bg-white"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05)', borderTop: '3px solid var(--red)' }}
      >
        <div className="p-[22px_24px]">{children}</div>
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const months = getMonths()
  const latest = months[months.length - 1]
  const data   = getData(latest ?? '')

  if (!months.length) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--muted)' }}>
        <p className="text-5xl mb-4">📂</p>
        <p className="text-lg font-semibold">Aún no hay datos cargados</p>
        <p className="text-sm mt-1">
          Sube el primer reporte en{' '}
          <a href="/upload" className="underline font-medium" style={{ color: 'var(--red)' }}>
            Cargar datos
          </a>.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-5">
        <span className="text-sm font-medium bg-white px-4 py-1.5" style={{ color: 'var(--muted)', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          {monthLabel(latest)} · {data.length} registros
        </span>
      </div>

      <KPICards data={data} />

      <Section
        title="Solicitudes en Proceso vs Completadas por Mes"
        tip="Compara mes a mes las solicitudes activas acumuladas contra las escrituradas. Haz clic en un punto para ver el detalle."
      >
        <SolicitudesChart data={data} />
      </Section>

      <Section
        title="Procesos por Departamento"
        note="(excluye Completados)"
        tip="Muestra cuántos procesos activos tiene cada departamento. Haz clic en una barra para ver los compradores."
      >
        <DepartamentosChart data={data} />
      </Section>

      <Section
        title="Solicitudes por Etapa del Proceso"
        note="(excluye Completados)"
        tip="Distribución de solicitudes activas en cada paso del flujo de escrituración, en orden secuencial."
      >
        <EtapasChart data={data} />
      </Section>

      <Section
        title="Estatus de Proceso"
        tip="Resumen general: cuántos procesos están activos, detenidos o completados. Abajo se desglosan motivos y áreas de detención."
      >
        <EstatusCharts data={data} />
      </Section>

      <Section
        title="Tiempo de Cierre por Etapa"
        tip="Días reales que tardó cada solicitud en cerrar cada etapa. Selecciona un folio para aislar su línea. La línea roja es el KPI límite."
      >
        <TiempoCierreChart data={data} />
      </Section>

      <Section
        title="Tiempo Promedio de Cierre vs KPI"
        tip="Compara la mediana de días reales contra el límite KPI de cada etapa. Filtra por folio para ver un caso específico."
      >
        <PromedioChart data={data} />
      </Section>
    </>
  )
}

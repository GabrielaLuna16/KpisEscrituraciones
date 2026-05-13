import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { EscrituracionRecord } from '@/types'
import { monthLabel } from '@/lib/dataHelpers'
import HistoricoClient from './HistoricoClient'

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

export default function HistoricoPage() {
  const months = getMonths()

  if (months.length < 2) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">📈</p>
        <p className="text-lg font-semibold">Se necesitan al menos 2 meses de datos</p>
        <p className="text-sm mt-1">Carga más reportes en <a href="/upload" className="text-blue-600 underline">Cargar datos</a>.</p>
      </div>
    )
  }

  // Pasar todos los datos al cliente para comparación interactiva
  const allData: Record<string, EscrituracionRecord[]> = {}
  months.forEach(m => { allData[m] = getData(m) })

  const summaries = months.map(m => {
    const d = allData[m]
    return {
      month: m,
      label: monthLabel(m),
      total: d.length,
      enProceso: d.filter(r => r.estatus === 'En proceso').length,
      detenidos: d.filter(r => r.estatus === 'Detenido').length,
      completados: d.filter(r => r.estatus === 'Completado').length,
    }
  })

  return <HistoricoClient months={months} summaries={summaries} allData={allData} />
}

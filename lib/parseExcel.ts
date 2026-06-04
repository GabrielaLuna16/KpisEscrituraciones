import * as XLSX from 'xlsx'
import type { EscrituracionRecord, Estatus } from '@/types'

function serialToISO(serial: unknown): string | null {
  if (serial == null || serial === '') return null
  const n = Number(serial)
  if (isNaN(n) || n <= 0) return null
  return new Date((n - 25569) * 86400 * 1000).toISOString().split('T')[0]
}

function num(v: unknown): number | null {
  if (v == null || v === '') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function str(v: unknown): string | null {
  if (v == null || v === '') return null
  return String(v).trim() || null
}

export function parseExcel(buffer: ArrayBuffer): EscrituracionRecord[] {
  const wb = XLSX.read(buffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })

  // Detectar fila de encabezados (contiene "Nombre del Comprador")
  const headerIdx = rows.findIndex(r =>
    Array.isArray(r) && String(r[0] ?? '').toLowerCase().includes('nombre')
  )
  if (headerIdx === -1) throw new Error('Encabezados no encontrados en el Excel')

  return rows
    .slice(headerIdx + 1)
    .filter(r => r[0] != null && r[1] != null)
    .map((r): EscrituracionRecord => ({
      nombre:        String(r[0] ?? ''),
      folio:         String(r[1] ?? ''),
      created:       serialToISO(r[2]) ?? new Date().toISOString().split('T')[0],
      // Las etapas vienen con prefijo numérico "01 Depto / Etapa" → se elimina
      etapa:         String(r[3] ?? '').replace(/^\d+\s+/, ''),
      estatus:       String(r[4] ?? '') as Estatus,
      area:          str(r[5]),
      motivo:        str(r[6]),
      baja:          Boolean(r[7]),
      cierre:        serialToISO(r[8]),
      // Cols J-X (índices 9-24): "Total días (etapa)" — días reales por etapa
      prefiltros:    num(r[9]),
      integracion:   num(r[10]),
      conciliacion:  num(r[11]),
      aprobacion:    num(r[12]),
      consolidacion: num(r[13]),
      validacion:    num(r[14]),
      notaria3:      num(r[15]),
      gestion:       num(r[16]),
      firma:         num(r[17]),
      notaria3_2:    num(r[18]),
      devolucion:    num(r[19]),
      cierreERP:     num(r[20]),
      facturacionCob:num(r[21]),
      facturacionVal:num(r[22]),
      timbrado:      num(r[23]),
      cierreContable:num(r[24]),
    }))
}

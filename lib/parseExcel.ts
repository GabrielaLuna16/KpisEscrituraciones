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
      etapa:         String(r[3] ?? ''),
      estatus:       String(r[4] ?? '') as Estatus,
      area:          str(r[5]),
      motivo:        str(r[6]),
      baja:          Boolean(r[7]),
      cierre:        serialToISO(r[8]),
      // Cols Z-AO (índices 25-40): días reales por etapa
      prefiltros:    num(r[25]),
      integracion:   num(r[26]),
      conciliacion:  num(r[27]),
      aprobacion:    num(r[28]),
      consolidacion: num(r[29]),
      validacion:    num(r[30]),
      notaria3:      num(r[31]),
      gestion:       num(r[32]),
      firma:         num(r[33]),
      notaria3_2:    num(r[34]),
      devolucion:    num(r[35]),
      cierreERP:     num(r[36]),
      facturacionCob:num(r[37]),
      facturacionVal:num(r[38]),
      timbrado:      num(r[39]),
      cierreContable:num(r[40]),
    }))
}

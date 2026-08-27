import * as XLSX from 'xlsx'
import type { EscrituracionRecord, Estatus } from '@/types'

function serialToISO(serial: unknown): string | null {
  if (serial == null || serial === '') return null
  if (serial instanceof Date && !isNaN(serial.getTime())) return serial.toISOString().split('T')[0]
  if (typeof serial === 'string') {
    const parsed = new Date(serial)
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0]
  }
  const n = Number(serial)
  if (isNaN(n) || n <= 0) return null
  return new Date((n - 25569) * 86400 * 1000).toISOString().split('T')[0]
}

function bool(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  return ['true', 'verdadero', 'sí', 'si', '1'].includes(String(v ?? '').trim().toLowerCase())
}

function normalizeHeader(v: unknown): string {
  return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
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

  const headerIdx = rows.findIndex(r => Array.isArray(r) && r.some(c => normalizeHeader(c) === 'nombre de escrituraciones'))
  if (headerIdx === -1) throw new Error('Encabezados no encontrados en el Excel')

  const headers = rows[headerIdx].map(normalizeHeader)
  const findColumn = (required: boolean, ...names: string[]) => {
    const normalizedNames = names.map(normalizeHeader)
    const idx = headers.findIndex(h => normalizedNames.includes(h))
    if (required && idx === -1) throw new Error(`Columna requerida no encontrada: ${names[0]}`)
    return idx
  }
  const col = (...names: string[]) => findColumn(true, ...names)

  const columns = {
    recordId: findColumn(false, 'ID de registro'), nombre: col('Nombre de Escrituraciones', 'Nombre del Comprador'),
    folio: col('Folio De Solicitud'), created: col('Hora de creación'), etapa: col('Etapa del Proceso'),
    estatus: col('Estatus de proceso'), area: col('Área'), motivo: col('Motivo de detención'),
    baja: col('Baja De Activo'), cierre: col('Cierre Contable'), prefiltros: col('Total Días Prefiltros'),
    integracion: col('Total días integración'), conciliacion: col('Total Días Conciliación y Estado de Cuenta'),
    aprobacion: col('Total Días Aprobación de Caratula de Conciliación'), consolidacion: col('Total Días Consolidación de Expediente'),
    validacion: col('Total Días Validación de Expediente'), notaria3: col('Total Días Notaria 3'), gestion: col('Total Días Gestión'),
    firma: col('Total Días Firma De Escrituras'), notaria3_2: col('Total Días Notaria 3 (2)'),
    devolucion: col('Total Días Cierre Actividad Devolución Expediente'), cierreERP: col('Total Días Cierre en ERP'),
    facturacionCob: col('Total Días Facturación'), facturacionVal: col('Total Días Facturación y Validación'),
    timbrado: col('Total Días Timbrado'), cierreContable: col('Total Días Cierre Contable'),
  }

  return rows
    .slice(headerIdx + 1)
    .filter(r => r[columns.nombre] != null && r[columns.folio] != null)
    .map((r): EscrituracionRecord => ({
      recordId:      columns.recordId >= 0 ? String(r[columns.recordId] ?? '').replace(/^zcrm_/, '') || null : null,
      nombre:        String(r[columns.nombre] ?? ''),
      folio:         String(r[columns.folio] ?? ''),
      created:       serialToISO(r[columns.created]) ?? new Date().toISOString().split('T')[0],
      // Las etapas vienen con prefijo numérico "01 Depto / Etapa" → se elimina
      etapa:         String(r[columns.etapa] ?? '').replace(/^\d+\s+/, ''),
      estatus:       String(r[columns.estatus] ?? '') as Estatus,
      area:          str(r[columns.area]), motivo: str(r[columns.motivo]),
      baja:          bool(r[columns.baja]), cierre: serialToISO(r[columns.cierre]),
      // Cols J-X (índices 9-24): "Total días (etapa)" — días reales por etapa
      prefiltros: num(r[columns.prefiltros]), integracion: num(r[columns.integracion]), conciliacion: num(r[columns.conciliacion]),
      aprobacion: num(r[columns.aprobacion]), consolidacion: num(r[columns.consolidacion]), validacion: num(r[columns.validacion]),
      notaria3: num(r[columns.notaria3]), gestion: num(r[columns.gestion]), firma: num(r[columns.firma]), notaria3_2: num(r[columns.notaria3_2]),
      devolucion: num(r[columns.devolucion]), cierreERP: num(r[columns.cierreERP]), facturacionCob: num(r[columns.facturacionCob]),
      facturacionVal: num(r[columns.facturacionVal]), timbrado: num(r[columns.timbrado]), cierreContable: num(r[columns.cierreContable]),
    }))
}

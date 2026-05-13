export type Estatus = 'En proceso' | 'Detenido' | 'Completado'

export interface EscrituracionRecord {
  nombre: string
  folio: string
  created: string        // YYYY-MM-DD
  etapa: string
  estatus: Estatus
  area: string | null
  motivo: string | null
  baja: boolean
  cierre: string | null  // YYYY-MM-DD
  // Días reales en cada etapa
  prefiltros: number | null
  integracion: number | null
  conciliacion: number | null
  aprobacion: number | null
  consolidacion: number | null
  validacion: number | null
  notaria3: number | null
  gestion: number | null
  firma: number | null
  notaria3_2: number | null
  devolucion: number | null
  cierreERP: number | null
  facturacionCob: number | null
  facturacionVal: number | null
  timbrado: number | null
  cierreContable: number | null
}

export interface StageKey {
  etapa: string
  key: keyof EscrituracionRecord
  short: string
  dept: string
}

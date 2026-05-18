import type { StageKey } from '@/types'

export const ETAPAS_ORDER = [
  'Admón. de Bienes / Intención de Escrituración',
  'Admón. de Bienes / Prefiltros',
  'Cobranza / Integración y Validación de Expediente',
  'Contraloría / Conciliación y Estado de Cuenta',
  'Cobranza / Aprobación de Caratula de Conciliación',
  'Admón. de Bienes / Consolidación de Expediente',
  'Legal / Validación de Expediente',
  'Legal / Notaria 3',
  'Legal / Gestión',
  'Admón. de Bienes / Firma De Escrituras',
  'Legal / Notaria 3 (2)',
  'Legal / Cierre Actividad Devolución Expediente',
  'Admón. de Bienes / Cierre en ERP',
  'Cobranza / Facturación',
  'Contabilidad / Facturación y Validación',
  'Fiscal / Timbrado',
  'Contabilidad-Cobranza / Cierre Contable',
]

export const STAGE_KEYS: StageKey[] = [
  { etapa: 'Admón. de Bienes / Prefiltros',              key: 'prefiltros',    short: 'Prefiltros',         dept: 'Admón. de Bienes' },
  { etapa: 'Cobranza / Integración y Validación',         key: 'integracion',   short: 'Integración y Val.', dept: 'Cobranza' },
  { etapa: 'Contraloría / Conciliación y Edo. Cta.',      key: 'conciliacion',  short: 'Conciliación',       dept: 'Contraloría' },
  { etapa: 'Cobranza / Aprobación de Carátula',           key: 'aprobacion',    short: 'Aprob. Carátula',    dept: 'Cobranza' },
  { etapa: 'Admón. de Bienes / Consolidación Exp.',       key: 'consolidacion', short: 'Consolidación Exp.', dept: 'Admón. de Bienes' },
  { etapa: 'Legal / Validación de Expediente',            key: 'validacion',    short: 'Validación Exp.',    dept: 'Legal' },
  { etapa: 'Legal / Notaria 3',                           key: 'notaria3',      short: 'Notaria 3',          dept: 'Legal' },
  { etapa: 'Legal / Gestión',                             key: 'gestion',       short: 'Gestión',            dept: 'Legal' },
  { etapa: 'Admón. de Bienes / Firma De Escrituras',      key: 'firma',         short: 'Firma Escrituras',   dept: 'Admón. de Bienes' },
  { etapa: 'Legal / Notaria 3 (2)',                       key: 'notaria3_2',    short: 'Notaria 3 (2)',      dept: 'Legal' },
  { etapa: 'Legal / Devolución Expediente',               key: 'devolucion',    short: 'Devolución Exp.',    dept: 'Legal' },
  { etapa: 'Admón. de Bienes / Cierre en ERP',            key: 'cierreERP',     short: 'Cierre ERP',         dept: 'Admón. de Bienes' },
  { etapa: 'Cobranza / Facturación',                      key: 'facturacionCob',short: 'Facturación',        dept: 'Cobranza' },
  { etapa: 'Contabilidad / Facturación y Validación',     key: 'facturacionVal',short: 'Fact. y Validación', dept: 'Contabilidad' },
  { etapa: 'Fiscal / Timbrado',                           key: 'timbrado',      short: 'Timbrado',           dept: 'Fiscal' },
  { etapa: 'Contabilidad-Cobranza / Cierre Contable',     key: 'cierreContable',short: 'Cierre Contable',    dept: 'Contabilidad-Cobranza' },
]

/** Colores por departamento (paleta ATISA) */
export const DEPT_COLORS: Record<string, string> = {
  'Admón. de Bienes':      '#e41e25',
  'Cobranza':              '#c77d00',
  'Contraloría':           '#1e5fa8',
  'Legal':                 '#1e7c4e',
  'Contabilidad':          '#7a1fa8',
  'Fiscal':                '#0891b2',
  'Contabilidad-Cobranza': '#b84000',
}

/** Líneas tenues para TiempoCierreChart cuando no hay folio seleccionado */
export const LINE_PALETTE = [
  'rgba(228,30,37,.35)',  'rgba(199,125,0,.35)',  'rgba(30,95,168,.35)',
  'rgba(30,124,78,.35)',  'rgba(8,145,178,.35)',  'rgba(122,31,168,.35)',
  'rgba(184,64,0,.35)',   'rgba(0,110,140,.35)',  'rgba(80,80,80,.35)',
  'rgba(160,30,60,.35)',  'rgba(0,120,90,.35)',   'rgba(100,60,0,.35)',
  'rgba(40,40,180,.35)',  'rgba(140,0,80,.35)',
]

/** Líneas sólidas para el folio seleccionado */
export const LINE_STRONG = [
  '#e41e25', '#c77d00', '#1e5fa8', '#1e7c4e',
  '#0891b2', '#7a1fa8', '#b84000', '#006e8c',
  '#505050', '#a01e3c', '#00785a', '#643c00',
  '#2828b4', '#8c0050',
]

/** Límite KPI en días por etapa */
export const KPI_LIMITS: Record<string, number> = {
  prefiltros: 5, integracion: 5, conciliacion: 5, aprobacion: 5,
  consolidacion: 5, validacion: 5, notaria3: 5, gestion: 5,
  firma: 5, notaria3_2: 5, devolucion: 5, cierreERP: 5,
  facturacionCob: 5, facturacionVal: 5, timbrado: 5, cierreContable: 5,
}

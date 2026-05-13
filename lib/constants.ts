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
  { etapa: 'Admón. de Bienes / Prefiltros',              key: 'prefiltros',    short: 'Prefiltros',          dept: 'Admón. de Bienes' },
  { etapa: 'Cobranza / Integración y Validación',         key: 'integracion',   short: 'Integración y Val.',  dept: 'Cobranza' },
  { etapa: 'Contraloría / Conciliación y Edo. Cta.',      key: 'conciliacion',  short: 'Conciliación',        dept: 'Contraloría' },
  { etapa: 'Cobranza / Aprobación de Carátula',           key: 'aprobacion',    short: 'Aprob. Carátula',     dept: 'Cobranza' },
  { etapa: 'Admón. de Bienes / Consolidación Exp.',       key: 'consolidacion', short: 'Consolidación Exp.',  dept: 'Admón. de Bienes' },
  { etapa: 'Legal / Validación de Expediente',            key: 'validacion',    short: 'Validación Exp.',     dept: 'Legal' },
  { etapa: 'Legal / Notaria 3',                           key: 'notaria3',      short: 'Notaria 3',           dept: 'Legal' },
  { etapa: 'Legal / Gestión',                             key: 'gestion',       short: 'Gestión',             dept: 'Legal' },
  { etapa: 'Admón. de Bienes / Firma De Escrituras',      key: 'firma',         short: 'Firma Escrituras',    dept: 'Admón. de Bienes' },
  { etapa: 'Legal / Notaria 3 (2)',                       key: 'notaria3_2',    short: 'Notaria 3 (2)',       dept: 'Legal' },
  { etapa: 'Legal / Devolución Expediente',               key: 'devolucion',    short: 'Devolución Exp.',     dept: 'Legal' },
  { etapa: 'Admón. de Bienes / Cierre en ERP',            key: 'cierreERP',     short: 'Cierre ERP',          dept: 'Admón. de Bienes' },
  { etapa: 'Cobranza / Facturación',                      key: 'facturacionCob',short: 'Facturación',         dept: 'Cobranza' },
  { etapa: 'Contabilidad / Facturación y Validación',     key: 'facturacionVal',short: 'Fact. y Validación',  dept: 'Contabilidad' },
  { etapa: 'Fiscal / Timbrado',                           key: 'timbrado',      short: 'Timbrado',            dept: 'Fiscal' },
  { etapa: 'Contabilidad-Cobranza / Cierre Contable',     key: 'cierreContable',short: 'Cierre Contable',     dept: 'Contabilidad-Cobranza' },
]

export const DEPT_COLORS: Record<string, string> = {
  'Admón. de Bienes':      '#2563eb',
  'Cobranza':              '#d97706',
  'Contraloría':           '#7c3aed',
  'Legal':                 '#059669',
  'Contabilidad':          '#dc2626',
  'Fiscal':                '#0891b2',
  'Contabilidad-Cobranza': '#be185d',
}

export const LINE_PALETTE = [
  '#2563eb','#d97706','#7c3aed','#059669','#0891b2','#be185d',
  '#4f46e5','#ea580c','#0d9488','#a21caf','#65a30d','#e11d48',
  '#0284c7','#b45309',
]

// Límite KPI en días por etapa (configurable)
export const KPI_LIMITS: Record<string, number> = {
  prefiltros: 5, integracion: 5, conciliacion: 5, aprobacion: 5,
  consolidacion: 5, validacion: 5, notaria3: 5, gestion: 5,
  firma: 5, notaria3_2: 5, devolucion: 5, cierreERP: 5,
  facturacionCob: 5, facturacionVal: 5, timbrado: 5, cierreContable: 5,
}

export function getMonthKey(d: string | null): string | null {
  if (!d) return null
  const dt = new Date(d + 'T00:00:00Z')
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(mk: string): string {
  const [y, m] = mk.split('-')
  const names = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${names[Number(m) - 1]} ${y}`
}

export function getDept(etapa: string): string {
  return etapa.split('/')[0].trim()
}

export function median(arr: number[]): number | null {
  if (!arr.length) return null
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

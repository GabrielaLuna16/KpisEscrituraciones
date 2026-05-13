import { NextRequest, NextResponse } from 'next/server'
import { parseExcel } from '@/lib/parseExcel'
import { publishMonthData } from '@/lib/github'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file  = form.get('file')  as File   | null
    const month = form.get('month') as string | null

    if (!file || !month) {
      return NextResponse.json({ error: 'Se requiere archivo y mes' }, { status: 400 })
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: 'Formato de mes inválido (YYYY-MM)' }, { status: 400 })
    }

    const buffer  = await file.arrayBuffer()
    const records = parseExcel(buffer)

    if (!records.length) {
      return NextResponse.json({ error: 'No se encontraron registros en el archivo' }, { status: 400 })
    }

    await publishMonthData(month, records)

    return NextResponse.json({ success: true, count: records.length, month })
  } catch (err) {
    console.error('[upload]', err)
    const msg = err instanceof Error ? err.message : 'Error al procesar el archivo'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { parseExcel } from '@/lib/parseExcel'
import { publishData } from '@/lib/github'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Se requiere un archivo Excel' }, { status: 400 })
    }

    const buffer  = await file.arrayBuffer()
    const records = parseExcel(buffer)

    if (!records.length) {
      return NextResponse.json({ error: 'No se encontraron registros en el archivo' }, { status: 400 })
    }

    await publishData(records)

    return NextResponse.json({ success: true, count: records.length })
  } catch (err) {
    console.error('[upload]', err)
    const msg = err instanceof Error ? err.message : 'Error al procesar el archivo'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

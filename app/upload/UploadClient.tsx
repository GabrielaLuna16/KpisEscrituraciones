'use client'
import { useState, useRef } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function UploadClient() {
  const fileRef  = useRef<HTMLInputElement>(null)
  const [file, setFile]     = useState<File | null>(null)
  const [month, setMonth]   = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [state, setState]   = useState<State>('idle')
  const [message, setMsg]   = useState('')
  const [count, setCount]   = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setState('loading')
    setMsg('')

    const form = new FormData()
    form.append('file', file)
    form.append('month', month)

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()

      if (!res.ok) {
        setState('error')
        setMsg(json.error ?? 'Error desconocido')
      } else {
        setState('success')
        setCount(json.count)
        setMsg(`Se publicaron ${json.count} registros para ${json.month}. Vercel redesplegará en ~60 segundos.`)
        setFile(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    } catch (err) {
      setState('error')
      setMsg('Error de red al conectar con el servidor')
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">¿Cómo exportar desde Zoho?</p>
        <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
          <li>Abre el módulo de Escrituración en Zoho CRM</li>
          <li>Filtra las solicitudes del mes a reportar</li>
          <li>Exporta como Excel (.xlsx) con todas las columnas</li>
          <li>Sube el archivo aquí y selecciona el mes</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Período del reporte
          </label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Archivo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Archivo Excel (.xlsx)
          </label>
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <div className="text-sm">
                <p className="text-2xl mb-1">📄</p>
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                <p className="text-3xl mb-2">📂</p>
                <p className="font-medium">Haz clic para seleccionar el archivo</p>
                <p className="text-xs mt-1">Solo archivos .xlsx exportados desde Zoho</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || state === 'loading'}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {state === 'loading' ? 'Procesando...' : 'Publicar datos'}
        </button>
      </form>

      {/* Resultado */}
      {state === 'success' && (
        <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
          <p className="font-semibold">✅ Publicado exitosamente</p>
          <p className="mt-0.5">{message}</p>
          <a href="/" className="inline-block mt-2 text-blue-600 underline text-xs">Ver dashboard →</a>
        </div>
      )}

      {state === 'error' && (
        <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          <p className="font-semibold">❌ Error al publicar</p>
          <p className="mt-0.5">{message}</p>
        </div>
      )}

      {/* Configuración requerida */}
      <div className="mt-8 border-t border-gray-100 pt-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Configuración requerida en Vercel</p>
        <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-600 space-y-1">
          <p>GITHUB_TOKEN=<span className="text-blue-600">ghp_tu_token_aqui</span></p>
          <p>GITHUB_OWNER=<span className="text-blue-600">GabrielaLuna16</span></p>
          <p>GITHUB_REPO=<span className="text-blue-600">KpisEscrituraciones</span></p>
        </div>
      </div>
    </div>
  )
}

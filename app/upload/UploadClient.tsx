'use client'
import { useState, useRef } from 'react'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function UploadClient() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile]   = useState<File | null>(null)
  const [state, setState] = useState<State>('idle')
  const [message, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setState('loading')
    setMsg('')

    const form = new FormData()
    form.append('file', file)

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()

      if (!res.ok) {
        setState('error')
        setMsg(json.error ?? 'Error desconocido')
      } else {
        setState('success')
        setMsg(`Se publicaron ${json.count} registros. Vercel redesplegará en ~60 segundos.`)
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
    <div className="bg-white p-8" style={{ borderTop: '3px solid var(--red)', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
      {/* Instrucciones */}
      <div className="mb-6 p-4 text-sm" style={{ background: 'var(--red-light)', borderLeft: '3px solid var(--red)' }}>
        <p className="font-condensed font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--red)' }}>
          ¿Cómo exportar desde Zoho?
        </p>
        <ol className="list-decimal list-inside space-y-0.5" style={{ color: 'var(--text)' }}>
          <li>Abre el módulo de Escrituración en Zoho CRM</li>
          <li>Exporta como Excel (.xlsx) con todas las columnas</li>
          <li>Sube el archivo aquí — los datos actuales serán reemplazados</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Área de drop */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
            Archivo Excel (.xlsx)
          </label>
          <div
            className="border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
            style={{ borderColor: file ? 'var(--red)' : 'var(--border)' }}
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <div className="text-sm">
                <p className="text-2xl mb-1">📄</p>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>{file.name}</p>
                <p style={{ color: 'var(--muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
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
          className="w-full py-3 text-white font-condensed font-bold uppercase tracking-widest text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--red)' }}
        >
          {state === 'loading' ? 'Procesando...' : 'Publicar datos'}
        </button>
      </form>

      {/* Resultado éxito */}
      {state === 'success' && (
        <div className="mt-5 p-4 text-sm" style={{ background: '#d4edda', borderLeft: '3px solid #1e8c4e' }}>
          <p className="font-semibold" style={{ color: '#155724' }}>✅ Publicado exitosamente</p>
          <p className="mt-0.5" style={{ color: '#155724' }}>{message}</p>
          <a href="/" className="inline-block mt-2 text-sm underline font-medium" style={{ color: 'var(--red)' }}>
            Ver dashboard →
          </a>
        </div>
      )}

      {/* Resultado error */}
      {state === 'error' && (
        <div className="mt-5 p-4 text-sm" style={{ background: '#fde8e8', borderLeft: '3px solid var(--red)' }}>
          <p className="font-semibold" style={{ color: '#8b0000' }}>❌ Error al publicar</p>
          <p className="mt-0.5" style={{ color: '#8b0000' }}>{message}</p>
        </div>
      )}

      {/* Config requerida */}
      <div className="mt-8 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
          Variables requeridas en Vercel
        </p>
        <div className="p-3 font-mono text-xs space-y-1" style={{ background: '#f5f5f5', color: 'var(--text)' }}>
          <p>GITHUB_TOKEN=<span style={{ color: 'var(--red)' }}>ghp_tu_token_aqui</span></p>
          <p>GITHUB_OWNER=<span style={{ color: 'var(--red)' }}>GabrielaLuna16</span></p>
          <p>GITHUB_REPO=<span style={{ color: 'var(--red)' }}>KpisEscrituraciones</span></p>
        </div>
      </div>
    </div>
  )
}

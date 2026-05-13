import UploadClient from './UploadClient'

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <h2 className="font-display text-2xl font-bold">Cargar Reporte Mensual</h2>
        <p className="text-gray-400 text-sm mt-1">Sube el Excel exportado desde Zoho para actualizar el dashboard.</p>
      </div>
      <UploadClient />
    </div>
  )
}

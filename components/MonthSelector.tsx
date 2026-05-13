'use client'
import { useRouter } from 'next/navigation'
import { monthLabel } from '@/lib/dataHelpers'

interface Props {
  months: string[]
  selected: string
  basePath?: string
}

export default function MonthSelector({ months, selected, basePath = '/' }: Props) {
  const router = useRouter()
  if (!months.length) return null

  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <span className="text-sm font-semibold text-gray-400 whitespace-nowrap">Período:</span>
      <div className="flex gap-1.5 flex-wrap">
        {months.map(m => (
          <button
            key={m}
            onClick={() => router.push(`${basePath}?month=${m}`)}
            className={[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap',
              selected === m
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-400 border-gray-200 hover:border-blue-500 hover:text-blue-600',
            ].join(' ')}
          >
            {monthLabel(m)}
          </button>
        ))}
      </div>
    </div>
  )
}

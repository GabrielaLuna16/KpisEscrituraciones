'use client'

interface Props {
  depts: string[]
  active: string
  onChange: (dept: string) => void
}

export default function DeptTabs({ depts, active, onChange }: Props) {
  return (
    <div className="flex gap-1.5 mb-4 flex-wrap">
      {['Todos', ...depts].map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap',
            active === d
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-400 border-gray-200 hover:border-blue-500 hover:text-blue-600',
          ].join(' ')}
        >{d}</button>
      ))}
    </div>
  )
}

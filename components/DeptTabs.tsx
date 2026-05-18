'use client'

interface Props {
  depts: string[]
  active: string
  onChange: (dept: string) => void
}

export default function DeptTabs({ depts, active, onChange }: Props) {
  return (
    <div className="flex gap-[5px] mb-4 flex-wrap">
      {['Todos', ...depts].map(d => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className="px-[14px] py-[5px] font-condensed text-[.8rem] font-bold tracking-[.06em] uppercase whitespace-nowrap border-[1.5px] transition-all cursor-pointer"
          style={
            active === d
              ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' }
              : { background: '#fff', color: 'var(--muted)', borderColor: 'var(--border2)' }
          }
          onMouseEnter={e => {
            if (active !== d) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--red)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--red)'
            }
          }}
          onMouseLeave={e => {
            if (active !== d) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border2)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'
            }
          }}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

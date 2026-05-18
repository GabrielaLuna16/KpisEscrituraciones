'use client'
import { useState, useRef } from 'react'

export default function TooltipIcon({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <span className="relative inline-flex shrink-0 ml-1" ref={ref}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        role="button"
        aria-label="Más información"
        className="inline-flex items-center justify-center w-[17px] h-[17px] rounded-full bg-[#e0e0e0] text-[.62rem] font-bold cursor-help select-none"
        style={{ color: 'var(--muted)' }}
      >
        ?
      </span>

      {visible && (
        <span
          role="tooltip"
          className="absolute z-50 left-1/2 bottom-[calc(100%+6px)] -translate-x-1/2 w-[230px] text-[.78rem] font-normal normal-case tracking-normal leading-[1.45] bg-[#1a1a1a] text-white px-3 py-2 pointer-events-none"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,.25)', borderLeft: '3px solid var(--red)' }}
        >
          {text}
          {/* Flecha */}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-full"
            style={{
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1a1a1a',
            }}
          />
        </span>
      )}
    </span>
  )
}

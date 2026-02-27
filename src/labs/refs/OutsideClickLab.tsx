import React, { useEffect, useRef, useState } from 'react'

function useOutsideClick<T extends HTMLElement>(
  targetRef: React.RefObject<T | null>,
  onOutside: () => void,
) {
  const latestOnOutsideRef = useRef<() => void>(onOutside)
  latestOnOutsideRef.current = onOutside

  useEffect(() => {
    const controller = new AbortController()
    function onPointerDown(e: PointerEvent) {
      const el = targetRef.current
      if (!el) return

      const target = e.target
      if (!(target instanceof Node)) return // защита для TS + edge cases

      if (!el.contains(target)) {
        latestOnOutsideRef?.current?.()
      }
    }

    document.addEventListener('pointerdown', onPointerDown, { signal: controller.signal })
    return () => controller.abort()
  }, [targetRef])
}

export default function OutsideClickLab() {
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  useOutsideClick(boxRef, () => setOpen(false))

  return (
    <div className='p-6 font-sans space-y-4'>
      <button className='rounded-xl border px-3 py-2' onClick={() => setOpen(true)}>
        Open panel
      </button>

      {open && (
        <div ref={boxRef} className='w-64 rounded-2xl border p-4 shadow-sm'>
          <div className='font-semibold'>Panel</div>
          <div className='text-sm text-gray-600'>Click outside to close.</div>
        </div>
      )}
    </div>
  )
}

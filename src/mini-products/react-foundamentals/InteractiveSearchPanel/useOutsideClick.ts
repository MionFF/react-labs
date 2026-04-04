import { useEffect, useRef } from 'react'

export function useOutsideClick<T extends HTMLElement>(
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

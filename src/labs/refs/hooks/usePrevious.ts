import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T) {
  const prevRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    prevRef.current = value
  }, [value])

  return prevRef.current
}

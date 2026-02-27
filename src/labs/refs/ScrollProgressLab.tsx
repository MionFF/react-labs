import { useEffect, useRef } from 'react'

export default function ScrollProgressLab() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let ticking = false

    function update() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      const progress = max > 0 ? scrollTop / max : 0
      const clamped = Math.min(1, Math.max(0, progress))

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamped})`
      }

      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className='min-h-[200vh] font-sans'>
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur border-b'>
        <div className='h-2 w-full bg-gray-200'>
          <div ref={barRef} className='h-2 origin-left bg-black scale-x-0' />
        </div>
        <div className='p-4 text-sm text-gray-600'>Scroll the page to see progress.</div>
      </div>

      <div className='p-6 space-y-3'>
        <div className='text-2xl font-semibold'>Scroll Progress</div>
        <p className='text-gray-700'>
          We update the bar via ref to avoid rerendering on every scroll tick.
        </p>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'

export default function EffectChurnLab() {
  const [n, setN] = useState(0)

  const onResize = useCallback(() => {
    // не важно что делает
  }, [])

  useEffect(() => {
    console.log('setup', n)
    window.addEventListener('resize', onResize)

    return () => {
      console.log('cleanup', n)
      window.removeEventListener('resize', onResize)
    }
  }, [n, onResize])

  return (
    <div className='p-4 space-y-3 font-sans'>
      <div className='text-lg font-semibold'>Effect churn lab</div>

      <button className='rounded-xl border px-3 py-2' onClick={() => setN(x => x + 1)}>
        rerender: {n}
      </button>

      <div className='text-sm text-gray-600'>Open console and click rerender a few times.</div>
    </div>
  )
}

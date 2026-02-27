import { useLayoutEffect, useRef, useState } from 'react'

export default function DomRefLab() {
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  useLayoutEffect(() => {
    // измеряем после commit, когда DOM уже в дереве
    const w = boxRef.current?.getBoundingClientRect().width ?? 0
    setWidth(Math.round(w))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <button onClick={focusInput} className='p-1 border rounded cursor-pointer'>
        Focus input
      </button>

      <div style={{ marginTop: 12 }}>
        <label>
          Search: <input ref={inputRef} placeholder='type...' />
        </label>
      </div>

      <div
        ref={boxRef}
        style={{
          marginTop: 12,
          padding: 12,
          border: '1px solid #ccc',
          width: '60%',
        }}
      >
        Box width: {width}px
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

export function ModalLab() {
  const [open, setOpen] = useState(false)
  const openBtnRef = useRef<HTMLButtonElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus()
    } else openBtnRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key !== 'Tab') return

      const root = dialogRef.current
      if (!root) return

      const focusables = root.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <button
        ref={openBtnRef}
        onClick={() => setOpen(true)}
        className='px-3 py-2 rounded cursor-pointer bg-indigo-800 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'
      >
        Open modal
      </button>

      {open ? (
        <div className='fixed inset-0 grid place-items-center p-6'>
          <div className='absolute inset-0 bg-black/50' onMouseDown={() => setOpen(false)} />

          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-title'
            aria-describedby='modal-desc'
            ref={dialogRef}
            className='relative w-full max-w-md rounded border bg-white p-4'
          >
            <h2 id='modal-title' className='text-lg font-semibold'>
              Confirm action
            </h2>
            <p id='modal-desc' className='mt-2 text-sm'>
              Are you sure you want to continue?
            </p>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                ref={closeBtnRef}
                onClick={() => setOpen(false)}
                className='px-3 py-2 rounded border focus-visible:outline-none focus-visible:ring-2'
              >
                Close
              </button>
              <button className='px-3 py-2 rounded bg-indigo-800 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'>
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

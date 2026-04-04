import { useReducer, useRef } from 'react'
import type { ReducerAction, ReducerState } from './types'

function assertRequestState(s: ReducerState) {
  if (s.status === 'success') {
    if (s.data === null || s.error !== null) throw new Error('Invalid success state')
  }

  if (s.status === 'error') {
    if (s.error === null || s.data !== null) throw new Error('Invalid error state')
  }

  if (s.status === 'idle' || s.status === 'loading') {
    if (s.data !== null || s.error !== null) throw new Error('Invalid idle/loading state')
  }
}

function withDevAssert(next: ReducerState) {
  if (process.env.NODE_ENV !== 'production') assertRequestState(next)
  return next
}

function requestReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case 'request/start': {
      if (state.status === 'loading') return state
      return withDevAssert({ status: 'loading', data: null, error: null })
    }

    case 'request/success': {
      if (state.status !== 'loading') return state
      return withDevAssert({ status: 'success', data: action.data, error: null })
    }

    case 'request/error': {
      if (state.status !== 'loading') return state
      return withDevAssert({ status: 'error', data: null, error: action.error })
    }

    case 'request/cancel': {
      if (state.status !== 'loading') return state
      return withDevAssert({ status: 'idle', data: null, error: null })
    }

    case 'request/retry': {
      if (state.status !== 'error') return state
      return withDevAssert({ status: 'loading', data: null, error: null })
    }

    default:
      return state
  }
}

export default function RequestSimulator() {
  const initialRequestState: ReducerState = { status: 'idle', data: null, error: null }
  const [requestState, dispatch] = useReducer(requestReducer, initialRequestState)
  const requestStatus = requestState.status

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  function invalidateInFlight() {
    requestIdRef.current += 1
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  function runRequest() {
    invalidateInFlight()
    const id = requestIdRef.current

    timeoutRef.current = setTimeout(() => {
      if (requestIdRef.current !== id) return

      if (Math.random() < 0.7) {
        dispatch({ type: 'request/success', data: 'Smth' })
      } else {
        dispatch({ type: 'request/error', error: 'Error' })
      }
    }, 1200)
  }

  const onRequestStart = () => {
    if (requestState.status === 'loading') return
    dispatch({ type: 'request/start' })

    runRequest()
  }

  const onRequestRetry = () => {
    if (requestState.status !== 'error') return
    dispatch({ type: 'request/retry' })

    runRequest()
  }

  const onRequestCancel = () => {
    if (requestState.status !== 'loading') return
    invalidateInFlight()
    dispatch({ type: 'request/cancel' })
  }

  const btnClassName = `
  p-1 border rounded transition
  hover:bg-[#666] hover:-translate-y-1 cursor-pointer
  disabled:opacity-50 disabled:cursor-not-allowed
  disabled:hover:bg-transparent disabled:hover:translate-y-0
  `

  return (
    <div className='min-h-screen bg-[#333] text-white'>
      <div className='flex flex-col gap-3 p-6 border border-[#777]'>
        <h1 className='font-bold my-3'>Status: {requestStatus}</h1>
        {requestState.data && <h2>Data: {requestState.data}</h2>}
        {requestState.error && <h2>Error: {requestState.error}</h2>}

        <div className='flex gap-3'>
          <button
            onClick={onRequestStart}
            disabled={requestState.status === 'loading'}
            className={btnClassName}
          >
            Load
          </button>
          <button
            onClick={onRequestRetry}
            disabled={requestState.status !== 'error'}
            className={btnClassName}
          >
            Retry
          </button>
          <button
            onClick={onRequestCancel}
            disabled={requestState.status !== 'loading'}
            className={btnClassName}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

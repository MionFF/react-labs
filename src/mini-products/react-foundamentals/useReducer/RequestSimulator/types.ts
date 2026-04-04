export type ReducerState =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: string; error: null }
  | { status: 'error'; data: null; error: string }

export type ReducerAction =
  | { type: 'request/start' }
  | { type: 'request/retry' }
  | { type: 'request/cancel' }
  | { type: 'request/success'; data: string }
  | { type: 'request/error'; error: string }

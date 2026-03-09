let count: number = 0
const listeners = new Set<() => void>()

export function getSnapshot() {
  return count
}

export function increment() {
  count++
  listeners.forEach(l => l())
}

export function decrement() {
  count--
  listeners.forEach(l => l())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

let history: string[] = []
const listeners = new Set<() => void>()

export function getSnapshot(): string[] {
  return history
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach(l => l())
}

export function addQuery(query: string) {
  const normalized = query.trim()

  if (!normalized) return

  const withoutDuplicates = history.filter(item => item !== normalized)
  history = [normalized, ...withoutDuplicates].slice(0, 10)

  emit()
}

export function clearHistory() {
  history = []
  emit()
}

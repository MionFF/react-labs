import { useEffect, useState } from 'react'
import { loadStatus } from './statusApi'

export function StatusBadge() {
  const [text, setText] = useState('Loading...')

  useEffect(() => {
    loadStatus()
      .then(value => setText(value))
      .catch(() => setText('Offline'))
  }, [])

  return <span>{text}</span>
}

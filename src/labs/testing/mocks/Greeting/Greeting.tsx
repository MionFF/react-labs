import { useEffect, useState } from 'react'
import { fetchGreeting } from './api'

export function Greeting() {
  const [text, setText] = useState('Loading...')

  useEffect(() => {
    fetchGreeting()
      .then(value => setText(value))
      .catch(() => setText('Error'))
  }, [])

  return <p>{text}</p>
}

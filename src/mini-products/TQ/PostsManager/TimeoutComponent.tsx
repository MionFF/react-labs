import { useEffect, useState } from 'react'

export default function TimeoutComponent({
  children,
  timeout = 1500,
}: {
  children: React.ReactNode
  timeout?: number
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false)
    }, timeout)
    return () => clearTimeout(timeoutId)
  }, [timeout])

  if (!visible) return null

  return <>{children}</>
}

import type React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

const styles = 'min-h-screen bg-[var(--bg-primary)] text-[var(--color)]'

export default function ScreenShell({ children, className }: Props) {
  return <div className={className ? `${styles} ${className}` : styles}>{children}</div>
}

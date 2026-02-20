import type React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
}

const styles =
  'p-6 border border-[var(--border)] rounded bg-[var(--bg-secondary)] transition duration-200 ease-out'

export default function Card({ children, className }: Props) {
  return <div className={className ? `${styles} ${className}` : styles}>{children}</div>
}

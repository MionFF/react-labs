import { memo } from 'react'
import type { User } from './types'

type UserCardProps = Pick<User, 'id' | 'name' | 'score'> & {
  pinned: boolean
  onTogglePin: (id: number) => void
}

export const UserCard = memo(({ id, name, score, pinned, onTogglePin }: UserCardProps) => {
  console.count('UserCard ' + id)

  return (
    <li className='flex justify-between max-w-sm p-6 my-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded transition duration-200 ease hover:-translate-y-2'>
      <div>
        <h2>Name: {name}</h2>
        <p>Score: {score}</p>
      </div>
      <button
        onClick={() => onTogglePin(id)}
        className='p-1 border border-[var(--border)] rounded cursor-pointer transition duration-200 hover:-translate-y-1 hover:opacity-85'
        aria-pressed={pinned}
        aria-label={pinned ? 'Unpin user' : 'Pin user'}
      >
        {pinned ? '🌟' : '⭐'}
      </button>
    </li>
  )
})

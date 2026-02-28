import EmptyState from './EmptyState'
import type { User } from './types'
import { UserCard } from './UserCard'

type UserWithPinned = User & { pinned: boolean }

type UsersListProps = {
  users: UserWithPinned[]
  onTogglePin: (id: number) => void
  emptyMessage: string
}

export default function UsersList({ users, onTogglePin, emptyMessage }: UsersListProps) {
  console.count('UsersList')

  return (
    <ul id='list' className='p-4 bg-[var(--bg-primary)] border border-[var(--border)]'>
      {users.length ? (
        users.map(user => (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            score={user.score}
            pinned={user.pinned}
            onTogglePin={onTogglePin}
          />
        ))
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </ul>
  )
}

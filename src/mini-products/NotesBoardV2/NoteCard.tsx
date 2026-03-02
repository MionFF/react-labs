import type { Note } from './types'

type NoteCardProps = Note & {
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onEditTitle: (id: string) => void
}

export default function NoteCard({
  id,
  title,
  text,
  updatedAt,
  pinned,
  onTogglePin,
  onDelete,
  onEditTitle,
}: NoteCardProps) {
  return (
    <li className='p-6 border border-[#777] my-2 transition duration-200 hover:-translate-y-1'>
      <h2 className='font-semibold'>{title}</h2>
      <p>{text}</p>
      <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>

      <div className='flex gap-2 my-2'>
        <button
          onClick={() => onTogglePin(id)}
          className='p-1 border border-[#777] rounded cursor-pointer transition duration-200 hover:-translate-y-1 hover:bg-[#666]'
          aria-pressed={pinned}
          aria-label={pinned ? `Unpin note ${title}` : `Pin note ${title}`}
        >
          {pinned ? '🌟' : '⭐'}
        </button>

        <button
          onClick={() => onEditTitle(id)}
          className='p-1 border border-[#777] rounded cursor-pointer transition duration-200 hover:-translate-y-1 hover:bg-[#666]'
        >
          Edit title
        </button>

        <button
          onClick={() => onDelete(id)}
          className='p-1 border border-[#777] rounded cursor-pointer transition duration-200 hover:-translate-y-1 hover:bg-[#666]'
          aria-label={`Delete note ${title}`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

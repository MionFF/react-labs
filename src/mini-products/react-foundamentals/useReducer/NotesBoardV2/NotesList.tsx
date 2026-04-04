import EmptyState from './EmptyState'
import NoteCard from './NoteCard'
import type { Note } from './types'

type NotesListProps = {
  notes: Note[]
  emptyMessage: string
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onEditTitle: (id: string) => void
}

export default function NotesList({
  notes,
  emptyMessage,
  onTogglePin,
  onDelete,
  onEditTitle,
}: NotesListProps) {
  return (
    <ul className='p-6 border border-[#777]'>
      {notes.length ? (
        notes.map(note => (
          <NoteCard
            key={note.id}
            id={note.id}
            title={note.title}
            text={note.text}
            updatedAt={note.updatedAt}
            pinned={note.pinned}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
            onEditTitle={onEditTitle}
          />
        ))
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </ul>
  )
}

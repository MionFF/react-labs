export type Note = {
  id: string
  title: string
  text: string
  updatedAt: number
  pinned: boolean
}

export type SortBy = 'updated' | 'title'

export type NotesState = {
  notes: Note[]
}

export type NotesAction =
  | { type: 'notes/togglePin'; id: string }
  | { type: 'notes/delete'; id: string }
  | { type: 'notes/add'; note: Note }
  | { type: 'notes/set'; notes: Note[] }
  | { type: 'notes/update'; id: string; patch: Partial<Pick<Note, 'title' | 'text' | 'updatedAt'>> }

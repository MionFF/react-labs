import { useId, useState } from 'react'

type Note = {
  id: number
  text: string
}

export default function NotesWithFilter() {
  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const inputId = useId()
  const filterId = useId()

  const emptyText = submitted && !text.trim().length ? "Note's text is empty" : ''

  const filteredNotes: Note[] = !query.trim().length
    ? notes
    : notes.filter((note: Note) => note.text.toLowerCase().includes(query.toLowerCase()))

  function handleAddSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    setSubmitted(true)

    if (!text.trim().length) {
      return
    }

    const newNote = { id: Date.now(), text: text.trim() }
    setNotes(prev => [...prev, newNote])
    setText('')
    setSubmitted(false)
  }

  function handleDelete(id: number) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className='p-6 border border-black'>
      <form id='add-section' className='flex items-center gap-2' onSubmit={handleAddSubmit}>
        <label htmlFor={inputId}>Add note:</label>
        <input
          type='text'
          name='text'
          value={text}
          id={inputId}
          className='border border-indigo-400'
          onChange={e => {
            const next = e.target.value
            setText(next)
            if (submitted && next.trim().length) setSubmitted(false)
          }}
          aria-invalid={Boolean(emptyText)}
          aria-describedby={emptyText ? `${inputId}-err` : undefined}
        />
        <button
          type='submit'
          className='cursor-pointer p-1 border border-indigo-400 rounded transition duration-200 ease hover:bg-indigo-400 hover:text-white'
        >
          Add
        </button>
        {submitted && emptyText ? (
          <p id={`${inputId}-err`} className='text-red-500' aria-live='polite'>
            {emptyText}
          </p>
        ) : null}
      </form>

      <div id='filter-section' className='flex items-center gap-2 my-4'>
        <label htmlFor={filterId}>Filter:</label>
        <input
          type='search'
          name='filter'
          value={query}
          id={filterId}
          className='border border-indigo-400'
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <ul className='flex flex-col gap-2 my-4'>
        {filteredNotes.length ? (
          filteredNotes.map((note: Note) => (
            <li
              key={note.id}
              className='flex justify-between p-4 border border-indigo-400 transition duration-300 ease hover:-translate-y-1 hover:bg-indigo-400 hover:text-white'
            >
              {note.text}
              <button
                type='button'
                className='p-1 mx-1 cursor-pointer bg-red-500 text-white rounded transition duration-300 ease hover:scale-105'
                onClick={() => handleDelete(note.id)}
                aria-label={`Delete note: ${note.text}`}
              >
                Delete
              </button>
            </li>
          ))
        ) : !notes.length ? (
          <li>No notes yet</li>
        ) : (
          notes.length > 0 && !filteredNotes.length && <li>No matches</li>
        )}
      </ul>
    </div>
  )
}

import { useId, useState } from 'react'
import type { Note } from './types'

type AddNoteFormProps = {
  onAdd(note: Note): void
}

export default function AddNoteForm({ onAdd }: AddNoteFormProps) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const titleId = useId()
  const textId = useId()

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const nextTitle = title.trim()
    const nextText = text.trim()

    if (!nextTitle && !nextText) return

    const note: Note = {
      id: crypto.randomUUID(),
      title: nextTitle,
      text: nextText,
      updatedAt: Date.now(),
      pinned: false,
    }
    onAdd(note)

    setTitle('')
    setText('')
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col p-6 border border-[#777]'>
      <h2 className='my-2 font-bold'>Add note</h2>

      <label htmlFor={titleId}>
        Title:{' '}
        <input
          type='text'
          name='title'
          placeholder='Title...'
          className='m-2 outline-none ring-2 ring-[#777]'
          id={titleId}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>

      <label htmlFor={textId}>
        Text:{' '}
        <input
          type='text'
          name='text'
          id={textId}
          placeholder='Text...'
          className='m-2 outline-none ring-2 ring-[#777]'
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>

      <button
        type='submit'
        className='p-1 my-2 w-fit border border-[#777] rounded cursor-pointer transition duration-200 ease hover:bg-[#666] hover:-translate-y-1'
      >
        Add note
      </button>
    </form>
  )
}

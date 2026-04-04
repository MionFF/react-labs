import { useState } from 'react'

type Props = {
  saveProfile: (input: { name: string }) => Promise<void>
}

export default function ProfileEditor({ saveProfile }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    const trimmed = name.trim()

    if (!trimmed) {
      setError('Name is required')
      setMessage('')
      return
    }

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      await saveProfile({ name: trimmed })
      setMessage('Profile saved')
      setName('')
    } catch {
      setError('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section>
      <h1>Profile Editor</h1>

      <label htmlFor='profile-name'>Name</label>
      <input id='profile-name' value={name} onChange={e => setName(e.target.value)} />

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>

      {message ? <p>{message}</p> : null}
      {error ? <p role='alert'>{error}</p> : null}
    </section>
  )
}

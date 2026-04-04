type Props = {
  onSave: (value: string) => void
}

export function SaveForm({ onSave }: Props) {
  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input id='name' />
      <button type='button' onClick={() => onSave('Denis')}>
        Save
      </button>
    </form>
  )
}

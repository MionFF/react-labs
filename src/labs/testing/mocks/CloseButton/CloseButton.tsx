type Props = {
  onClose: () => void
}

export function CloseButton({ onClose }: Props) {
  return <button onClick={onClose}>Close</button>
}

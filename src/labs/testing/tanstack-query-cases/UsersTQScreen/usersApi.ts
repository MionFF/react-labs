export type User = {
  id: number
  name: string
}

export async function fetchUsers(): Promise<User[]> {
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Jack' },
  ]
}

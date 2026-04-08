export type User = {
  id: number
  name: string
}

export async function searchUsers(query: string): Promise<User[]> {
  if (query === 'Mion') {
    return [{ id: 1, name: 'Mion' }]
  } else if (query === 'ErrorCase') {
    throw new Error('Failed to search user')
  } else return []
}

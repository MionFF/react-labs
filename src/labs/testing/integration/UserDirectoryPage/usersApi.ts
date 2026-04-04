export type User = {
  id: number
  name: string
}

export async function searchUsers(query: string): Promise<User[]> {
  console.log(query)
  return []
}

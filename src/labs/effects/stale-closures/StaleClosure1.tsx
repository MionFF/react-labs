import { useEffect, useState } from 'react'

type User = {
  name: string
  age: number
}

export default function Profile({ userId }: { userId: string | number }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then(r => r.json())
      .then(setUser)
  }, [userId])

  return <div>{user?.name}</div>
}

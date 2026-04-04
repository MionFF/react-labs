export type Todo = {
  id: number
  title: string
}

export async function fetchTodos(): Promise<Todo[]> {
  return [
    { id: 1, title: 'Learn testing' },
    { id: 2, title: 'Write RTL tests' },
  ]
}

export async function createTodo(input: { title: string }): Promise<void> {
  return console.log(input)
}

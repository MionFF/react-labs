import type { SearchItem } from './types'

function generateData(amount: number) {
  const result: SearchItem[] = []

  for (let i = 0; i < amount; i++) {
    const newItem = {
      id: i + 1,
      title: `Item ${i + 1}`,
      description: `${i + 1}. Lorem ipsum dolor, sit amet consectetur adipisicing.`,
    }
    result.push(newItem)
  }

  return result
}

export function fetchSearchItems(shouldFail: boolean): Promise<SearchItem[]> {
  return new Promise((resolve, reject) => {
    if (!shouldFail) {
      setTimeout(() => {
        resolve(generateData(3000))
      }, 800)
    } else {
      setTimeout(() => {
        reject(new Error('Error fetching data!'))
      }, 800)
    }
  })
}

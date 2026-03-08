import { Virtuoso } from 'react-virtuoso'

type Item = {
  id: number
  title: string
  description: string
}

function generateData(amount: number): Item[] {
  const result = []
  for (let i = 0; i < amount; i++) {
    const newItem = {
      id: i + 1,
      title: `Item ${i + 1}`,
      description: `${i + 1} - Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque id officia nihil?`,
    }
    result.push(newItem)
  }
  return result
}

const items = generateData(10000)

export default function HugeListBaseline() {
  return (
    <div className='h-[400px] m-6 border-2'>
      <Virtuoso
        style={{ height: '100%' }}
        totalCount={items.length}
        itemContent={index => {
          const item = items[index]

          return (
            <div className='p-4 my-2 border rounded transition duration-200 ease hover:-translate-y-1'>
              <h2 className='font-semibold'>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          )
        }}
      />
    </div>
  )
}

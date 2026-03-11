import { Virtuoso } from 'react-virtuoso'
import EmptyState from './EmptyState'
import ResultItem from './ResultItem'
import type { SearchItem } from './types'

type ResultsListProps = {
  data: SearchItem[]
  emptyMessage: string
  isLoading: boolean
  error: string | null
  query: string
}

export default function ResultsList({
  data,
  emptyMessage,
  isLoading,
  error,
  query,
}: ResultsListProps) {
  return (
    <div className='h-[500px] overflow-auto p-6 my-4 border'>
      {isLoading ? (
        <p role='status' aria-live='polite'>
          Loading...
        </p>
      ) : error ? (
        <p role='status' aria-live='polite'>
          Error: {error}
        </p>
      ) : data.length ? (
        <Virtuoso
          className='h-full'
          totalCount={data.length}
          itemContent={index => {
            const item = data[index]

            return <ResultItem title={item.title} description={item.description} query={query} />
          }}
        />
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  )
}

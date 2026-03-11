type ResultItemProps = {
  title: string
  description: string
  query: string
}

function highlightMatch(text: string, query: string) {
  if (!query) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const matchIndex = lowerText.indexOf(lowerQuery)

  if (matchIndex === -1) return text

  const before = text.slice(0, matchIndex)
  const match = text.slice(matchIndex, matchIndex + query.length)
  const after = text.slice(matchIndex + query.length)

  return (
    <>
      {before}
      <span className='bg-[#777] rounded w-fit'>{match}</span>
      {after}
    </>
  )
}

export default function ResultItem({ title, description, query }: ResultItemProps) {
  return (
    <article className='p-4 my-2 border rounded transition duration-200 ease hover:-translate-y-1 hover:bg-[#444]'>
      <h2>{highlightMatch(title, query)}</h2>
      <p>{description}</p>
    </article>
  )
}

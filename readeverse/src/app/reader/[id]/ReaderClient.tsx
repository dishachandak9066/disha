'use client'

import { useEffect, useState } from 'react'

interface Book {
  id: number
  title: string
  author: string
  textUrl: string
  
}

export default function ReaderClient({
  book,
}: {
  book: Book
}) {
  const [content, setContent] = useState('Loading book...')

 useEffect(() => {
  async function loadBook() {
    try {
      const response = await fetch(
        `/api/books/${book.id}`
      )

      const data = await response.json()

      console.log(data)

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to fetch'
        )
      }

      // Chapters exist
      if (
        data.book?.chapters &&
        data.book.chapters.length > 0
      ) {
        const fullContent =
          data.book.chapters
            .map(
              (chapter: any) =>
                chapter.content
            )
            .join('\n\n')

        setContent(fullContent)

        return
      }

      setContent(
        'No chapters available.'
      )

    } catch (error: any) {
      console.error(error)

      setContent(
        error.message ||
          'Failed to load content.'
      )
    }
  }

  loadBook()
}, [book.id])
  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">
        {book.title}
      </h1>

      <p className="text-lg mb-8 text-gray-400">
        by {book.author}
      </p>

      <div className="whitespace-pre-wrap leading-8 text-lg">
        {content}
      </div>
    </div>
  )
}
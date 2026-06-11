import { notFound } from 'next/navigation'
import ReaderClient from './ReaderClient'
import { API_BASE_URL } from '@/lib/api'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ReaderPage({
  params,
}: Props) {
  const { id } = await params

  let book = null
  try {
    const res = await fetch(`${API_BASE_URL}/api/books/${id}`)
    if (res.ok) {
      const data = await res.json()
      book = data.book
    }
  } catch (error) {
    console.error('Failed to fetch book in reader page:', error)
  }

  if (!book) {
    notFound()
  }

  return <ReaderClient book={book} />
}


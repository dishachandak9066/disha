import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReaderClient from './ReaderClient'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ReaderPage({
  params,
}: Props) {
  const { id } = await params

  const book = await prisma.books.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!book) {
    notFound()
  }

  return <ReaderClient book={book} />
}
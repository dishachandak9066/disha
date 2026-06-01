'use client'

import { useEffect, useState } from 'react'

interface Book {
  id: number
  title: string
  author: string
  textUrl: string
}

interface Chapter {
  chapterNumber: number
  title: string
  content: string
}

export default function ReaderClient({
  book,
}: {
  book: Book
}) {
  const [content, setContent] = useState('Loading book...')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)

  useEffect(() => {
    async function loadBook() {
      try {
        const response = await fetch(
          `/api/books/${book.id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to fetch'
          )
        }

        if (
          data.book?.chapters &&
          data.book.chapters.length > 0
        ) {
          setChapters(data.book.chapters)

          const fullContent =
            data.book.chapters
              .map(
                (chapter: Chapter) =>
                  chapter.content
              )
              .join('\n\n')

          setContent(fullContent)
          return
        }

        setContent('No chapters available.')
      } catch (error: any) {
        console.error(error)

        setContent(
          error.message ||
            'Failed to load content.'
        )
      }
    }

    loadBook()

    return () => {
      speechSynthesis.cancel()
    }
  }, [book.id])

  function splitText(
    text: string,
    maxLength = 800
  ) {
    const chunks: string[] = []

    for (
      let i = 0;
      i < text.length;
      i += maxLength
    ) {
      chunks.push(
        text.slice(i, i + maxLength)
      )
    }

    return chunks
  }

  const speakChapter = (
    chapterIndex: number
  ) => {
    if (
      chapterIndex >= chapters.length
    ) {
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentChapter(0)
      return
    }

    const chapter =
      chapters[chapterIndex]

    const chunks = splitText(
      chapter.content
    )

    let chunkIndex = 0

    const speakChunk = () => {
      if (
        chunkIndex >= chunks.length
      ) {
        const nextChapter =
          chapterIndex + 1

        if (
          nextChapter <
          chapters.length
        ) {
          setCurrentChapter(
            nextChapter
          )

          speakChapter(
            nextChapter
          )
        } else {
          setIsSpeaking(false)
          setIsPaused(false)
          setCurrentChapter(0)
        }

        return
      }

      const utterance =
        new SpeechSynthesisUtterance(
          chunks[chunkIndex]
        )

      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        chunkIndex++
        speakChunk()
      }

      utterance.onerror = (
        event
      ) => {
        console.error(
          'Speech error:',
          event.error
        )

        setIsSpeaking(false)
        setIsPaused(false)
      }

      speechSynthesis.speak(
        utterance
      )
    }

    speakChunk()
  }

  const playAudio = () => {
    if (
      chapters.length === 0
    )
      return

    speechSynthesis.cancel()

    setCurrentChapter(0)

    speakChapter(0)
  }

  const pauseAudio = () => {
    speechSynthesis.pause()
    setIsPaused(true)
  }

  const resumeAudio = () => {
    speechSynthesis.resume()
    setIsPaused(false)
  }

  const stopAudio = () => {
    speechSynthesis.cancel()

    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentChapter(0)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">
        {book.title}
      </h1>

      <p className="text-lg mb-8 text-gray-400">
        by {book.author}
      </p>

      <div className="mb-8 border border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">
          🎧 Audiobook
        </h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={playAudio}
            className="px-4 py-2 bg-green-600 rounded"
          >
            ▶ Play
          </button>

          <button
            onClick={pauseAudio}
            disabled={!isSpeaking}
            className="px-4 py-2 bg-yellow-600 rounded disabled:opacity-50"
          >
            ⏸ Pause
          </button>

          <button
            onClick={resumeAudio}
            disabled={!isPaused}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            ▶ Resume
          </button>

          <button
            onClick={stopAudio}
            className="px-4 py-2 bg-red-600 rounded"
          >
            ⏹ Stop
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          {isSpeaking
            ? `Reading Chapter ${
                currentChapter + 1
              } of ${chapters.length}`
            : 'Not Playing'}
        </p>
      </div>

      <div className="whitespace-pre-wrap leading-8 text-lg">
        {content}
      </div>
    </div>
  )
}
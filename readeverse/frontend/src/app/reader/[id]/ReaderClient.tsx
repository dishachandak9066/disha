'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import { ArrowLeft, Play, Pause, Square, Sparkles } from 'lucide-react'

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
  const router = useRouter()
  const [content, setContent] = useState('Loading book...')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [progress, setProgress] = useState<number>(0)
  const isStoppingRef = useRef(false)
  const isPlayingRef = useRef(false)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [cachedSummary, setCachedSummary] = useState<string | null>(null)

  useEffect(() => {
    console.log("BOOK ID:", book.id)
  }, [book.id])



  const handleSummary = async () => {
    setShowSummary(true)
    setLoadingSummary(true)

    try {
      const res = await fetch(`/api/books/${book.id}/summary`)

      let data
      try {
        data = await res.json()
      } catch (e) {
        setSummary("Invalid response from server")
        setLoadingSummary(false)
        return
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch summary")
      }

      if (!data?.summary) {
        setSummary("No summary returned from server")
        return
      }

      setSummary(data.summary)
      setCachedSummary(data.summary)
    } catch (err: any) {
      console.error(err)
      setSummary("Failed to load summary")
    } finally {
      setLoadingSummary(false)
    }
  }



  useEffect(() => {
    async function loadBook() {
      try {
        const data = await apiFetch(`/api/books/${book.id}`)

        if (!data) {
          throw new Error('Failed to fetch book')
        }

        // Save to history only after successful load
        await apiFetch('/api/history', {
          method: 'POST',
          data: {
            bookId: book.id,
          },
        })

        if (data.book?.chapters && data.book.chapters.length > 0) {
          setChapters(data.book.chapters)

          const fullContent = data.book.chapters
            .map((chapter: Chapter) => chapter.content)
            .join('\n\n')

          setContent(fullContent)
          return
        }

        setContent('No chapters available.')
      } catch (error: any) {
        console.error(error)
        setContent(error.message || 'Failed to load content.')
      }
    }

    loadBook()

    return () => {
      isStoppingRef.current = true
      speechSynthesis.cancel()
    }
  }, [book.id])

  function splitText(text: string, maxLength = 300) {
    const sentences = text.split(/(?<=[.?!])\s+/)
    const chunks: string[] = []
    let current = ""

    for (const sentence of sentences) {
      if ((current + sentence).length > maxLength) {
        chunks.push(current)
        current = sentence
      } else {
        current += (current ? " " : "") + sentence
      }
    }

    if (current) chunks.push(current)
    return chunks
  }

  const saveProgress = async (progressVal: number, chapterVal: number) => {
    try {
      await apiFetch('/api/reading-progress', {
        method: 'POST',
        data: {
          bookId: book.id,
          progress: progressVal,
          currentChapter: chapterVal,
        },
      })
    } catch (error) {
      console.error('Progress save failed', error)
    }
  }

  const speakChapter = (chapterIndex: number) => {
    if (chapterIndex >= chapters.length) {
      isPlayingRef.current = false
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentChapter(0)
      return
    }

    const chapter = chapters[chapterIndex]
    const chunks = splitText(chapter.content)
    let chunkIndex = 0

    const speakChunk = () => {
      if (isStoppingRef.current) return

      if (chunkIndex >= chunks.length) {
        const progressVal = ((chapterIndex + 1) / chapters.length) * 100
        setProgress(progressVal)
        saveProgress(progressVal, chapterIndex + 1)

        const nextChapter = chapterIndex + 1

        if (nextChapter < chapters.length) {
          setCurrentChapter(nextChapter)
          speakChapter(nextChapter)
        } else {
          isPlayingRef.current = false
          setIsSpeaking(false)
          setIsPaused(false)
          setCurrentChapter(0)
        }
        return
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex])
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        if (isStoppingRef.current) return
        chunkIndex++

        setTimeout(() => {
          if (!isStoppingRef.current) {
            speakChunk()
          }
        }, 50)
      }

      utterance.onerror = (event) => {
        if (
          event.error === 'interrupted' ||
          event.error === 'canceled' ||
          isStoppingRef.current
        ) {
          return
        }

        console.error('Speech error:', event.error)
        isPlayingRef.current = false
        setIsSpeaking(false)
        setIsPaused(false)
      }

      speechSynthesis.speak(utterance)
    }

    speakChunk()
  }

  const playAudio = () => {
    if (chapters.length === 0) return
    if (isPlayingRef.current) return

    isStoppingRef.current = false
    isPlayingRef.current = true
    setIsSpeaking(true)
    setIsPaused(false)

    speechSynthesis.cancel()
    speakChapter(currentChapter)
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
    isStoppingRef.current = true
    speechSynthesis.cancel()
    isPlayingRef.current = false
    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentChapter(0)
    setProgress(0)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0e14]">
      {/* Left Sidebar (Audio player panel) */}
      <div className="w-full md:w-80 flex-shrink-0 bg-white border-r border-gray-200 p-6 md:p-8 flex flex-col justify-between text-gray-900 md:h-screen md:sticky md:top-0">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Read-E-Verse Logo" className="w-8 h-8 object-contain" />
            <h2 className="text-xl font-bold tracking-wider text-gray-900">
              AUDIO<span className="text-primary">-PLAYER</span>
            </h2>
          </div>

          {/* Vertical Button Stack */}
          <div className="flex flex-col gap-1.5">
            {/* Play Button */}
            <button
              onClick={playAudio}
              disabled={isSpeaking && !isPaused}
              className="w-full py-3 px-4 bg-primary/15 hover:bg-primary/20 active:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed text-primary font-medium rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-5 h-5 text-primary" />
              <span className="text-sm">Play</span>
            </button>

            {/* Pause Button */}
            <button
              onClick={pauseAudio}
              disabled={!isSpeaking || isPaused}
              className="w-full py-3 px-4 hover:bg-gray-50 hover:text-primary active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-medium rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer"
            >
              <Pause className="w-5 h-5 text-gray-500" />
              <span className="text-sm">Pause</span>
            </button>

            {/* Resume Button */}
            <button
              onClick={resumeAudio}
              disabled={!isSpeaking || !isPaused}
              className="w-full py-3 px-4 hover:bg-gray-50 hover:text-primary active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-medium rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-5 h-5 text-gray-500" />
              <span className="text-sm">Resume</span>
            </button>

            {/* Stop Button */}
            <button
              onClick={stopAudio}
              disabled={!isSpeaking && !isPaused}
              className="w-full py-3 px-4 hover:bg-gray-50 hover:text-primary active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 font-medium rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer"
            >
              <Square className="w-5 h-5 text-gray-500" />
              <span className="text-sm">Stop</span>
            </button>

            {/* AI Summary Button */}
            <button
              onClick={handleSummary}
              className="w-full py-3 px-4 hover:bg-gray-50 hover:text-primary active:bg-gray-100 text-gray-600 font-medium rounded-xl flex items-center gap-3 transition-all duration-200 cursor-pointer mt-2"
            >
              <Sparkles className="w-5 h-5 text-gray-500" />
              <span className="text-sm">AI Summary</span>
            </button>
          </div>

          {/* Status text */}
          <div className="mt-6 text-sm text-gray-400 font-medium">
            {isSpeaking
              ? isPaused
                ? 'Paused'
                : `Reading Chapter ${currentChapter + 1} of ${chapters.length}`
              : 'Not Playing'}
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="mt-8">
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                <span>Reading Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => router.push('/dashboard/library')}
            className="flex items-center gap-3 w-full py-3 px-4 hover:bg-gray-50 hover:text-primary text-gray-600 font-medium rounded-xl transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Back to Library</span>
          </button>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0e14]">

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            {/* Book Title & Author */}
            <div className="mb-10 text-center border-b border-gray-800 pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
                {book.title}
              </h1>
              <p className="text-lg text-purple-400 font-medium">
                by {book.author}
              </p>
            </div>

            {/* Book Content - Serif font for premium reading */}
            <div className="font-serif text-lg md:text-xl text-gray-300 leading-relaxed tracking-wide select-text whitespace-pre-wrap pb-20 text-justify">
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Modal Popup */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowSummary(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 p-1.5 rounded-lg cursor-pointer text-lg font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-4">
              <Sparkles className="w-5 h-5 text-purple-600 fill-purple-100" />
              <h3 className="text-xl font-bold text-slate-900">AI Summary</h3>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 min-h-0 pr-2">
              {loadingSummary ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Distilling the chapters...</span>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                  {summary}
                </p>
              )}
            </div>

            {/* Footer */}
            {!loadingSummary && (
              <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
                <button
                  onClick={() => setShowSummary(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

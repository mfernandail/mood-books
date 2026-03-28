import { useEffect, useState } from 'react'
import moods from '../data/moods.json'
import styles from '../styles/MoodGallery.module.css'
import { BookModal } from './BookModal'

const ACCENT_MAP = {
  amber: '#fbbf24',
  teal: '#0d9488',
  blue: '#2563eb',
  coral: '#fb7185',
  purple: '#7c3aed',
  red: '#ef4444',
  pink: '#ec4899',
  gray: '#6b7280',
  green: '#10b981',
}

const BOOK_RESULTS_LIMIT = 6

const buildBooksUrl = (genres) => {
  const query = genres.map((genre) => encodeURIComponent(genre)).join('+')
  return `https://openlibrary.org/search.json?q=${query}&limit=${BOOK_RESULTS_LIMIT}`
}

const mapBooksPayload = (docs = []) =>
  docs.slice(0, BOOK_RESULTS_LIMIT).map((doc) => {
    const rawDescription = Array.isArray(doc.first_sentence)
      ? doc.first_sentence[0]
      : doc.first_sentence
    const idFallback = `${doc.title ?? 'book'}-${doc.first_publish_year ?? ''}`

    return {
      id: doc.key ?? idFallback,
      title: doc.title ?? 'Título desconocido',
      authors: doc.author_name ?? [],
      categories: doc.subject?.slice(0, 3) ?? [],
      thumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      description:
        typeof rawDescription === 'string'
          ? rawDescription
          : (rawDescription?.value ?? 'Sinopsis no disponible.'),
      infoLink: doc.key ? `https://openlibrary.org${doc.key}` : null,
      publishedDate: doc.first_publish_year?.toString() ?? '',
    }
  })

export function MoodGallery() {
  const [activeMood, setActiveMood] = useState(null)
  const [books, setBooks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [booksError, setBooksError] = useState(null)

  const handleMoodClick = (mood) => {
    setActiveMood(mood)
    setIsModalOpen(true)
  }

  const handleMoodKeyDown = (event, mood) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleMoodClick(mood)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setActiveMood(null)
    setBooks([])
    setBooksError(null)
    setIsLoadingBooks(false)
  }

  useEffect(() => {
    if (!activeMood) {
      return
    }

    let isCancelled = false
    const controller = new AbortController()

    const fetchBooksForMood = async () => {
      setIsLoadingBooks(true)
      setBooks([])
      setBooksError(null)

      try {
        const response = await fetch(buildBooksUrl(activeMood.genres), {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Request failed')
        }

        const data = await response.json()
        if (isCancelled) {
          return
        }
        setBooks(mapBooksPayload(data.docs))
      } catch (error) {
        if (isCancelled || error.name === 'AbortError') {
          return
        }
        setBooksError('No pudimos cargar recomendaciones en este momento.')
      } finally {
        if (!isCancelled) {
          setIsLoadingBooks(false)
        }
      }
    }

    fetchBooksForMood()

    // Cancel in-flight requests when the mood changes or the modal closes.
    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [activeMood])

  return (
    <section className={styles.gallery} aria-labelledby="moods-heading">
      <header className={styles.galleryHeader}>
        <p className="eyebrow">Explora tus emociones</p>
        <div>
          <h2 id="moods-heading" className={styles.title}>
            Encuentra lecturas según tu mood
          </h2>
          <p className={styles.summary}>
            Cada tarjeta sugiere géneros que armonizan con la energía del
            momento.
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        {moods.map((mood) => {
          const accent = ACCENT_MAP[mood.color] ?? '#0f172a'

          return (
            <article
              key={mood.id}
              className={styles.moodCard}
              style={{ '--mood-accent': accent }}
              tabIndex={0}
              role="button"
              aria-label={`Abrir recomendaciones para ${mood.label}`}
              onClick={() => handleMoodClick(mood)}
              onKeyDown={(event) => handleMoodKeyDown(event, mood)}
            >
              <div className={styles.cardHeader}>
                <span
                  className={styles.emoji}
                  role="img"
                  aria-label={mood.label}
                >
                  {mood.emoji}
                </span>
                <div>
                  <p className={styles.cardLabel}>{mood.label}</p>
                  <p className={styles.cardGenres}>
                    {mood.genres.slice(0, 2).join(' • ')}
                  </p>
                </div>
              </div>

              <ul className={styles.tagList}>
                {mood.genres.slice(0, 4).map((genre) => (
                  <li key={`${mood.id}-${genre}`}>{genre}</li>
                ))}
              </ul>

              <p className={styles.keywords}>{mood.keywords.join(' • ')}</p>
            </article>
          )
        })}
      </div>

      <BookModal
        isOpen={isModalOpen}
        mood={activeMood}
        books={books}
        loading={isLoadingBooks}
        error={booksError}
        onClose={handleModalClose}
        accentColor={
          activeMood ? (ACCENT_MAP[activeMood.color] ?? '#0f172a') : '#0f172a'
        }
      />
    </section>
  )
}

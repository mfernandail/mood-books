import { useEffect } from 'react'
import styles from '../styles/BookModal.module.css'

export function BookModal({
  isOpen,
  mood,
  books,
  loading,
  error,
  onClose,
  accentColor = '#0f172a',
}) {
  const hasBooks = Array.isArray(books) && books.length > 0

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !mood) {
    return null
  }

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        style={{ '--modal-accent': accentColor }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Cerrar recomendaciones"
          onClick={onClose}
        >
          Cerrar
        </button>

        <header className={styles.header}>
          <div>
            <p className="eyebrow">Mood seleccionado</p>
            <h3 id="book-modal-title">{mood.label}</h3>
            <p className={styles.subtitle}>
              Exploramos géneros como {mood.genres.slice(0, 3).join(', ')} para
              encontrar coincidencias.
            </p>
          </div>
          <ul className={styles.genreList}>
            {mood.genres.map((genre) => (
              <li key={`${mood.id}-${genre}`}>{genre}</li>
            ))}
          </ul>
        </header>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.state}>
              <span className={styles.spinner} aria-hidden="true" />
              <p>Cargando recomendaciones...</p>
            </div>
          ) : error ? (
            <div className={styles.state}>
              <p>{error}</p>
              <p className={styles.helper}>
                Cierra el modal e intenta de nuevo.
              </p>
            </div>
          ) : hasBooks ? (
            <ul className={styles.bookList}>
              {books.map((book) => (
                <li key={book.id} className={styles.bookCard}>
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={`Portada del libro ${book.title}`}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={styles.thumbnailPlaceholder}
                      aria-hidden="true"
                    >
                      {book.title.slice(0, 1)}
                    </div>
                  )}

                  <div>
                    <h4>{book.title}</h4>
                    {book.authors.length > 0 && (
                      <p className={styles.meta}>{book.authors.join(', ')}</p>
                    )}
                    {book.categories.length > 0 && (
                      <p className={styles.meta}>
                        {book.categories.join(' • ')}
                      </p>
                    )}
                    {book.publishedDate && (
                      <p className={styles.date}>
                        Publicado: {book.publishedDate}
                      </p>
                    )}
                    <p className={styles.description}>{book.description}</p>
                    <div className={styles.cardFooter}>
                      {book.infoLink && (
                        <a
                          href={book.infoLink}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Ver en Google Books
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.state}>
              <p>No encontramos coincidencias para este mood.</p>
              <p className={styles.helper}>
                Prueba con otra combinación o vuelve a intentarlo en unos
                minutos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

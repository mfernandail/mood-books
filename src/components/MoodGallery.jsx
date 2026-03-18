import moods from '../data/moods.json'
import styles from '../styles/MoodGallery.module.css'

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

export function MoodGallery() {
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
    </section>
  )
}

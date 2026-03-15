import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from '../styles/SessionPanel.module.css'

export function SessionPanel({ user }) {
  const [status, setStatus] = useState({ loading: false, error: '' })
  const profile = useMemo(() => {
    const metadata = user?.user_metadata ?? {}
    const fullName =
      metadata.full_name ||
      metadata.name ||
      metadata.given_name ||
      metadata.first_name ||
      'Lector Mood'
    const email = user?.email ?? 'sin-email'
    const picture = metadata.picture || metadata.avatar_url || ''
    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .map((chunk) => chunk[0]?.toUpperCase())
      .slice(0, 2)
      .join('')
    const lastSignIn = user?.last_sign_in_at
      ? new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(user.last_sign_in_at))
      : '—'

    return { fullName, email, picture, initials: initials || 'MB', lastSignIn }
  }, [user])

  const handleSignOut = async () => {
    setStatus({ loading: true, error: '' })
    const { error } = await supabase.auth.signOut()

    if (error) {
      setStatus({ loading: false, error: error.message })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <section className={`panel ${styles.panelSession}`}>
      <p className="eyebrow">Mood Books</p>
      <h1>
        Hola, {profile.fullName.split(' ')[0] || 'lector'}. Tu energía ya
        inspira nuevas recomendaciones.
      </h1>
      <p className="lead">
        Guarda tus estados de ánimo, sincroniza tu biblioteca y déjanos sugerir
        lecturas que acompañen el momento.
      </p>

      <div className={styles.sessionCard}>
        <div className={styles.sessionUser}>
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.fullName}
              className={styles.avatar}
            />
          ) : (
            <div
              className={`${styles.avatar} ${styles.avatarFallback}`}
              aria-hidden="true"
            >
              {profile.initials}
            </div>
          )}

          <div>
            <p className={styles.sessionName}>{profile.fullName}</p>
            <p className={styles.sessionEmail}>{profile.email}</p>
          </div>
        </div>

        <dl className={styles.sessionMeta}>
          <div className={styles.sessionMetaItem}>
            <dt>ID</dt>
            <dd>{user.id.slice(0, 8)}...</dd>
          </div>
          <div className={styles.sessionMetaItem}>
            <dt>Último acceso</dt>
            <dd>{profile.lastSignIn}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.sessionActions}>
        <button
          className={styles.logoutButton}
          onClick={handleSignOut}
          disabled={status.loading}
        >
          {status.loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
        <button className={styles.secondaryButton} type="button">
          Ver biblioteca personalizada
        </button>
      </div>

      {status.error ? <p className={styles.error}>{status.error}</p> : null}
    </section>
  )
}

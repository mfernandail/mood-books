import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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
    <section className="panel panel--session">
      <p className="eyebrow">Mood Books</p>
      <h1>
        Hola, {profile.fullName.split(' ')[0] || 'lector'}. Tu energía ya
        inspira nuevas recomendaciones.
      </h1>
      <p className="lead">
        Guarda tus estados de ánimo, sincroniza tu biblioteca y déjanos sugerir
        lecturas que acompañen el momento.
      </p>

      <div className="session-card">
        <div className="session-user">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.fullName}
              className="avatar"
            />
          ) : (
            <div className="avatar avatar--fallback" aria-hidden="true">
              {profile.initials}
            </div>
          )}

          <div>
            <p className="session-name">{profile.fullName}</p>
            <p className="session-email">{profile.email}</p>
          </div>
        </div>

        <dl className="session-meta">
          <div>
            <dt>ID</dt>
            <dd>{user.id.slice(0, 8)}...</dd>
          </div>
          <div>
            <dt>Último acceso</dt>
            <dd>{profile.lastSignIn}</dd>
          </div>
        </dl>
      </div>

      <div className="session-actions">
        <button
          className="logout-button"
          onClick={handleSignOut}
          disabled={status.loading}
        >
          {status.loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
        <button className="secondary-button" type="button">
          Ver biblioteca personalizada
        </button>
      </div>

      {status.error ? <p className="error">{status.error}</p> : null}
    </section>
  )
}

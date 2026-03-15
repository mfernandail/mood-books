import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const moods = ['serena', 'vibrante', 'curiosa', 'valiente', 'audaz']

export function LoginPanel() {
  const [status, setStatus] = useState({ loading: false, error: '' })
  const accentWord = useMemo(
    () => moods[Math.floor(Math.random() * moods.length)],
    [],
  )

  const handleGoogleLogin = async () => {
    setStatus({ loading: true, error: '' })
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setStatus({ loading: false, error: error.message })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <section className="panel panel--login">
      <p className="eyebrow">Mood Books</p>
      <h1>Inicia sesión y deja que tu lectura se vuelva {accentWord}.</h1>
      <p className="lead">
        Conecta tu cuenta de Google para sincronizar tus estados de ánimo con
        recomendaciones creadas a tu medida.
      </p>

      <button
        className="google-button"
        onClick={handleGoogleLogin}
        disabled={status.loading}
      >
        <span className="google-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path
              d="M21.6 12.23c0-.82-.07-1.62-.21-2.39H12v4.52h5.46c-.24 1.2-.95 2.3-1.99 3.01v2.5h3.16c1.85-1.71 2.97-4.27 2.97-7.64z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.7 0 4.98-.9 6.64-2.44l-3.16-2.5c-.92.62-2.09.98-3.48.98-2.63 0-4.86-1.77-5.66-4.15H3.03v2.55C4.68 19.86 8.07 22 12 22z"
              fill="#34A853"
            />
            <path
              d="M6.34 13.89c-.2-.6-.31-1.23-.31-1.89 0-.66.11-1.3.31-1.89V7.56H3.03A9.99 9.99 0 0 0 2 12c0 1.57.36 3.05 1.03 4.44z"
              fill="#FBBC05"
            />
            <path
              d="M12 7.58c1.48 0 2.81.51 3.84 1.5l2.88-2.88C16.97 4.2 14.69 3.2 12 3.2a9.99 9.99 0 0 0-9 5.4l3.33 2.56C7.12 8.78 9.37 7.58 12 7.58z"
              fill="#EA4335"
            />
          </svg>
        </span>
        {status.loading ? 'Conectando...' : 'Entrar con Google'}
      </button>

      {status.error ? <p className="error">{status.error}</p> : null}

      <p className="footnote">
        Usamos Google únicamente para autenticarte. No publicamos nada sin tu
        permiso.
      </p>
    </section>
  )
}

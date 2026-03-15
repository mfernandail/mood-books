import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from '../styles/LoginPanel.module.css'

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
    <section className={`panel ${styles.panelLogin}`}>
      <p className="eyebrow">Mood Books</p>
      <h1>Inicia sesión y deja que tu lectura se vuelva {accentWord}.</h1>
      <p className="lead">
        Conecta tu cuenta de Google para sincronizar tus estados de ánimo con
        recomendaciones creadas a tu medida.
      </p>

      <button
        className={styles.googleButton}
        onClick={handleGoogleLogin}
        disabled={status.loading}
      >
        {status.loading ? 'Conectando...' : 'Entrar con Google'}
      </button>

      {status.error ? <p className={styles.error}>{status.error}</p> : null}

      <p className={styles.footnote}>
        Usamos Google únicamente para autenticarte. No publicamos nada sin tu
        permiso.
      </p>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

const moods = ['serena', 'vibrante', 'curiosa', 'valiente']

function App() {
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
    <main className="page">
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />

      <section className="panel">
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
          {status.loading ? 'Conectando...' : 'Entrar con Google'}
        </button>

        {status.error ? <p className="error">{status.error}</p> : null}

        <p className="footnote">
          Usamos Google únicamente para autenticarte. No publicamos nada sin tu
          permiso.
        </p>
      </section>
    </main>
  )
}

export default App

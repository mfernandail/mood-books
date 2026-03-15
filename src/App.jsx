import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { LoginPanel } from './components/LoginPanel'
import { SessionPanel } from './components/SessionPanel'
import { supabase } from './lib/supabaseClient'

function LoadingPanel() {
  const accent = useMemo(() => {
    const phrases = [
      'Sincronizando tu estado...',
      'Buscando coincidencias literarias...',
      'Afinando recomendaciones a tu ánimo...',
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }, [])

  return (
    <section className="panel panel--loading">
      <p className="eyebrow">Mood Books</p>
      <h1>Preparando tu rincón personal.</h1>
      <p className="lead">{accent}</p>
      <div className="spinner" aria-hidden="true" />
    </section>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return
        }
        setSession(data.session)
      })
      .finally(() => {
        if (isMounted) {
          setCheckingSession(false)
        }
      })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession)
        }
      },
    )

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const pageMode = checkingSession
    ? 'page--loading'
    : session
      ? 'page--session'
      : 'page--login'

  return (
    <main className={`page ${pageMode}`}>
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />

      {checkingSession ? (
        <LoadingPanel />
      ) : session ? (
        <SessionPanel user={session.user} />
      ) : (
        <LoginPanel />
      )}
    </main>
  )
}

export default App

import { useState, useEffect } from 'react'
import { supabase } from "./services/supabaseClient.js";
import { Navbar } from "./components/Navbar.jsx";
import { Home } from "./pages/Home.jsx";


function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Verifica a sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escuta mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="app-container">
      <Navbar session={session} />
      <main style={{ padding: '20px' }}>
        <Home />
      </main>
    </div>
  )
}

export default App
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';
import { ProfileCard } from './components/Card';
import { EditProfile } from './pages/Edit'; // Importe a nova página de edição

// Placeholders para as outras páginas
const MyMissions = () => <div className="timeline"><h2 className="timeline-title">Minhas Missões</h2><p>Gerencie as missões que você postou.</p></div>;
const MyProposals = () => <div className="timeline"><h2 className="timeline-title">Minhas Propostas</h2><p>Acompanhe os lances que você enviou.</p></div>;
const Completed = () => <div className="timeline"><h2 className="timeline-title">Concluídos</h2><p>Histórico de serviços finalizados.</p></div>;

function App() {
  const [session, setSession] = useState(null);
  const [city, setCity] = useState('Porto Alegre');
  const [page, setPage] = useState('home');

  useEffect(() => {
    // Busca sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Monitora mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função que decide o que renderizar na área de conteúdo (direita ou centro)
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home city={city} />;
      case 'perfil':
        // Renderiza a página de edição centralizada
        return <EditProfile user={session.user} />;
      case 'minhas-missoes':
        return <MyMissions />;
      case 'minhas-propostas':
        return <MyProposals />;
      case 'concluidos':
        return <Completed />;
      default:
        return <Home city={city} />;
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-main-wrapper">
      <Navbar city={city} setCity={setCity} setPage={setPage} />
      
      {/* A classe 'main-layout' gerencia o Flexbox.
          Se estivermos na página 'perfil', adicionamos uma classe extra 
          para centralizar o conteúdo único.
      */}
      <main className={`app-container main-layout ${page === 'perfil' ? 'centered-layout' : ''}`}>
        
        {/* LÓGICA SOLICITADA: 
            O Card da esquerda só aparece se NÃO estivermos na página de perfil.
        */}
        {page !== 'perfil' && (
          <ProfileCard user={session.user} setPage={setPage} />
        )}

        <div className="content-area">
          {renderPage()}
        </div>

      </main>
    </div>
  );
}

export default App;
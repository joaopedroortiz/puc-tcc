import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';
import { ProfileCard } from './components/Card';

// Componentes temporários para as novas páginas (Você pode movê-los para arquivos próprios depois)
const MyMissions = () => <div className="timeline"><h2 className="timeline-title">Minhas Missões</h2><p>Aqui aparecerão as missões que você postou.</p></div>;
const MyProposals = () => <div className="timeline"><h2 className="timeline-title">Minhas Propostas</h2><p>Aqui aparecerão os lances que você enviou.</p></div>;
const Completed = () => <div className="timeline"><h2 className="timeline-title">Concluídos</h2><p>Histórico de missões finalizadas.</p></div>;

function App() {
  const [session, setSession] = useState(null);
  const [city, setCity] = useState('Porto Alegre');
  
  // NOVO: Estado que controla qual página deve ser exibida na coluna da direita
  const [page, setPage] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função que decide o que renderizar na coluna da direita (content-area)
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home city={city} />;
      case 'perfil':
        // No caso do "Meu Perfil", como o card já está na esquerda, 
        // podemos mostrar uma mensagem ou uma versão expandida.
        return (
          <div className="timeline">
            <h2 className="timeline-title">Meu Perfil</h2>
            <p>Use o card à esquerda para gerenciar suas informações de contato e bio.</p>
          </div>
        );
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
      {/* Agora passamos o setPage para o Navbar controlar os cliques no menu */}
      <Navbar city={city} setCity={setCity} setPage={setPage} />
      
      <main className="app-container main-layout">
        
        {/* O ProfileCard permanece fixo à esquerda em todas as páginas logadas */}
        <ProfileCard user={session.user} />

        <div className="content-area">
          {/* Renderização dinâmica baseada no estado 'page' */}
          {renderPage()}
        </div>

      </main>
    </div>
  );
}

export default App;
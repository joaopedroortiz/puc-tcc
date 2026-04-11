import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';
import { ProfileCard } from './components/Card';
import { EditProfile } from './pages/Edit';
import { CreateMission } from './pages/CreateMission'; // Importando a nova página

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

  // Função que decide o que renderizar na área de conteúdo
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home city={city} />;
      case 'perfil':
        return <EditProfile user={session.user} />;
      case 'criar-missao': // Nova rota para criação de missão
        return (
          <CreateMission 
            user={session.user} 
            currentCity={city} 
            setPage={setPage} 
            setGlobalCity={setCity} // Para alinhar a cidade da missão com o filtro global
          />
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

  // Definimos se a página atual deve esconder o ProfileCard e centralizar o conteúdo
  const isFullWidthPage = page === 'perfil' || page === 'criar-missao';

  return (
    <div className="app-main-wrapper">
      <Navbar city={city} setCity={setCity} setPage={setPage} page={page}/>
      
      <main className={`app-container main-layout ${isFullWidthPage ? 'centered-layout' : ''}`}>
        
        {/* O Card da esquerda não aparece em páginas de formulário (Perfil ou Criar Missão) */}
        {!isFullWidthPage && (
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
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';
import { ProfileCard } from './components/Card';
import { EditProfile } from './pages/Edit';
import { CreateMission } from './pages/CreateMission';
import { MissionDetails } from './pages/MissionDetails'; // Importe a página de detalhes

// Placeholders para as outras páginas
const MyMissions = () => <div className="timeline"><h2 className="timeline-title">Minhas Missões</h2><p>Gerencie as missões que você postou.</p></div>;
const MyProposals = () => <div className="timeline"><h2 className="timeline-title">Minhas Propostas</h2><p>Acompanhe os lances que você enviou.</p></div>;
const Completed = () => <div className="timeline"><h2 className="timeline-title">Concluídos</h2><p>Histórico de serviços finalizados.</p></div>;

function App() {
  const [session, setSession] = useState(null);
  const [city, setCity] = useState('Porto Alegre');
  const [page, setPage] = useState('home');
  const [selectedMission, setSelectedMission] = useState(null); // Estado para a missão clicada

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <Home 
            city={city} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        );
      case 'detalhes-missao':
        return (
          <MissionDetails 
            mission={selectedMission} 
            user={session.user} 
            setPage={setPage} 
          />
        );
      case 'perfil':
        return <EditProfile user={session.user} />;
      case 'criar-missao':
        return (
          <CreateMission 
            user={session.user} 
            currentCity={city} 
            setPage={setPage} 
            setGlobalCity={setCity} 
          />
        );
      case 'minhas-missoes':
        return <MyMissions />;
      case 'minhas-propostas':
        return <MyProposals />;
      case 'concluidos':
        return <Completed />;
      default:
        return (
          <Home 
            city={city} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        );
    }
  };

  if (!session) {
    return <Login />;
  }

  // Páginas que ocupam a largura total (sem o ProfileCard lateral)
  const isFullWidthPage = page === 'perfil' || page === 'criar-missao' || page === 'detalhes-missao';

  return (
    <div className="app-main-wrapper">
      <Navbar city={city} setCity={setCity} setPage={setPage} page={page}/>
      
      <main className={`app-container main-layout ${isFullWidthPage ? 'centered-layout' : ''}`}>
        
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
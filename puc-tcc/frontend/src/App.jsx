import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';
import { ProfileCard } from './components/Profilecard';
import { EditProfile } from './pages/Edit';
import { CreateMission } from './pages/CreateMission';
import { MissionDetails } from './pages/MissionDetails';
import { MyMissions } from './pages/MyMissions';
import { MyProposals } from './pages/MyProposals'; // Importação do novo componente
import { Completed } from './pages/Completed';

function App() {
  const [session, setSession] = useState(null);
  const [city, setCity] = useState('Porto Alegre');
  const [page, setPage] = useState('home');
  const [selectedMission, setSelectedMission] = useState(null);

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
            user={session?.user}
          />
        );
      case 'detalhes-missao':
        return (
          <MissionDetails 
            mission={selectedMission} 
            user={session?.user} 
            setPage={setPage} 
          />
        );
      case 'perfil':
        return <EditProfile user={session?.user} />;
      case 'criar-missao':
        return (
          <CreateMission 
            user={session?.user} 
            currentCity={city} 
            setPage={setPage} 
            setGlobalCity={setCity} 
          />
        );
      case 'minhas-missoes':
        return (
          <MyMissions 
            user={session?.user} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        );
      case 'minhas-propostas':
        return (
          <MyProposals 
            user={session?.user} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        );
      case 'concluidos':
        return (
          <Completed 
            user={session?.user} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        );
      default:
        return (
          <Home 
            city={city} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
            user={session?.user}
          />
        );
    }
  };

  if (!session) {
    return <Login />;
  }

  // Define quais páginas ocupam a largura total da tela (sem ProfileCard lateral)
  const isFullWidthPage = ['perfil', 'criar-missao', 'detalhes-missao'].includes(page);

  return (
    <div className="app-main-wrapper">
      <Navbar city={city} setCity={setCity} setPage={setPage} page={page}/>
      
      <main className={`app-container main-layout ${isFullWidthPage ? 'centered-layout' : ''}`}>
        
        {!isFullWidthPage && (
          <ProfileCard user={session?.user} setPage={setPage} />
        )}

        <div className="content-area">
          {renderPage()}
        </div>

      </main>
    </div>
  );
}

export default App;
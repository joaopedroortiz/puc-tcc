import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard'; // Nome corrigido

// Adicionamos 'user' às props
export function Home({ city, setPage, setSelectedMission, user }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*') 
        .eq('city', city)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error("Erro ao carregar missões:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [city]);

  return (
    <div className="timeline">
      <h2 className="timeline-title">Missões disponíveis em {city}</h2>
      
      {loading ? (
        <div className="empty-msg">Buscando oportunidades...</div>
      ) : missions.length > 0 ? (
        missions.map((mission) => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            user={user} // Agora 'user' vem das props da Home
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        ))
      ) : (
        <div className="empty-msg">
          <p>Ainda não há missões abertas em {city}.</p>
          <span>Seja o primeiro a publicar uma necessidade!</span>
        </div>
      )}
    </div>
  );
}
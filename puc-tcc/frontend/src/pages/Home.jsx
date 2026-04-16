import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export function Home({ city, setPage, setSelectedMission, user }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          proposals (*)
        `) 
        .eq('city', city)
        .neq('status', 'Finalizada') // 👈 FILTRO: Remove missões concluídas da Home
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
    setLoading(true);
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
            user={user}
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
            refreshMissions={fetchMissions} 
          />
        ))
      ) : (
        <div className="empty-msg">
          <p>Ainda não há missões abertas em {city}.</p>
          <span>Que tal publicar uma nova necessidade?</span>
        </div>
      )}
    </div>
  );
}
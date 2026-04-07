import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function Home({ city }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          profiles (full_name)
        `)
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
    // Removi o 'home-container' para evitar conflitos de margem com o 'content-area'
    <div className="timeline">
      <h2 className="timeline-title">Missões disponíveis em {city}</h2>
      
      {loading ? (
        <div className="empty-msg">Buscando oportunidades...</div>
      ) : missions.length > 0 ? (
        // Removi a div 'mission-list' para os cards ficarem um abaixo do outro conforme o CSS
        missions.map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <h3>{mission.title}</h3>
              <span className="status-badge">{mission.status}</span>
            </div>
            
            <p className="mission-card-p">{mission.description}</p>
            
            <div className="mission-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
              <div className="user-info">
                <small style={{ display: 'block', color: 'var(--royal)' }}>Postado por:</small>
                <span style={{ fontWeight: '600' }}>{mission.profiles?.full_name || 'Usuário'}</span>
              </div>
              <button className="btn-proposta">Ver Lances</button>
            </div>
          </div>
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
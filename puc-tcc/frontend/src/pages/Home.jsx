import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function Home({ city }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar missões filtradas pela cidade do cabeçalho
  const fetchMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('city', city) // Filtro dinâmico vindo da Prop
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error("Erro ao carregar missões:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // IMPORTANTE: Sempre que a 'city' mudar no Navbar, o useEffect dispara a busca
  useEffect(() => {
    fetchMissions();
  }, [city]);

  return (
    <div className="home-container">
      <section className="timeline">
        <h2 className="timeline-title">Missões disponíveis em {city}</h2>
        
        {loading ? (
          <div className="loading-state">Buscando oportunidades...</div>
        ) : missions.length > 0 ? (
          <div className="mission-list">
            {missions.map((mission) => (
              <div key={mission.id} className="mission-card">
                <div className="mission-header">
                  <h3>{mission.title}</h3>
                  <span className="status-badge">{mission.status}</span>
                </div>
                
                <p className="mission-description">{mission.description}</p>
                
                <div className="mission-footer">
                  <div className="user-info">
                    <small>Postado por:</small>
                    <span>{mission.profiles?.full_name || 'Usuário'}</span>
                  </div>
                  {/* Botão com a cor Coral (#FF4D4D) via CSS */}
                  <button className="btn-proposta">Ver Lances</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-msg">
            <p>Ainda não há missões abertas em {city}.</p>
            <span>Seja o primeiro a publicar uma necessidade!</span>
          </div>
        )}
      </section>
    </div>
  );
}
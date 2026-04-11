import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function Home({ city }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      // Ajuste no SELECT: Removida a dependência de 'profiles' por enquanto
      // para garantir que os cards apareçam. 
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

  // Função para formatar o preço para Real Brasileiro
  const formatCurrency = (value) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="timeline">
      <h2 className="timeline-title">Missões disponíveis em {city}</h2>
      
      {loading ? (
        <div className="empty-msg">Buscando oportunidades...</div>
      ) : missions.length > 0 ? (
        missions.map((mission) => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <h3>{mission.title}</h3>
              <span className={`status-badge ${mission.status?.toLowerCase()}`}>
                {mission.status}
              </span>
            </div>
            
            <p className="mission-card-p">{mission.description}</p>
            
            <div className="mission-details-row" style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              <span>📍 {mission.neighborhood}</span>
              <span style={{ marginLeft: '15px' }}>💰 {formatCurrency(mission.price)}</span>
            </div>
            
            <div className="mission-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '15px' }}>
              <div className="user-info">
                <small style={{ display: 'block', color: 'var(--royal)' }}>Localização:</small>
                <span style={{ fontWeight: '600' }}>{mission.city}</span>
              </div>
              <button className="btn-proposta">Fazer Proposta</button>
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
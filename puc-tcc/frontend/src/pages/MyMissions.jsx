import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export const MyMissions = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select(`
          *,
          proposals (*) 
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (err) {
      console.error("Erro ao buscar missões:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyMissions();
  }, [user?.id]);

  // FUNÇÃO NOVA: Lógica de "Marcar como Lido" ao clicar
  const handleOpenMission = async (mission) => {
    try {
      // 1. Atualiza no banco: todas as propostas desta missão que eram 'false' viram 'true'
      const { error } = await supabase
        .from('proposals')
        .update({ is_read: true })
        .eq('mission_id', mission.id)
        .eq('is_read', false);

      if (error) throw error;

      // 2. Atualiza o estado global para a página de detalhes
      setSelectedMission(mission);
      setPage('detalhes-missao');
      
    } catch (err) {
      console.error("Erro ao atualizar status de leitura:", err.message);
      // Mesmo se der erro no update, deixamos o usuário entrar na página
      setSelectedMission(mission);
      setPage('detalhes-missao');
    }
  };

  return (
    <div className="timeline">
      <h2 className="timeline-title">Minhas Missões</h2>
      <p style={{marginBottom: '20px', color: '#64748b'}}>Gerencie as oportunidades que você publicou.</p>

      {loading ? (
        <div className="empty-msg">Carregando suas missões...</div>
      ) : missions.length > 0 ? (
        missions.map((mission) => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            user={user}
            setPage={setPage} 
            // Substituímos o setSelectedMission direto pela nossa nova função
            setSelectedMission={() => handleOpenMission(mission)} 
          />
        ))
      ) : (
        <div className="empty-msg">
          <p>Você ainda não publicou nenhuma missão.</p>
          <button className="btn-main-action" onClick={() => setPage('criar-missao')}>
            Publicar minha primeira missão
          </button>
        </div>
      )}
    </div>
  );
};
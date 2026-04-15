import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export const MyProposals = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProposedMissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          mission_id,
          missions (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const uniqueMissionsMap = new Map();
      data.forEach(item => {
        if (item.missions && item.missions.is_active) {
          uniqueMissionsMap.set(item.missions.id, item.missions);
        }
      });

      const activeMissions = Array.from(uniqueMissionsMap.values());
      setMissions(activeMissions);
    } catch (err) {
      console.error("Erro ao carregar propostas:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProposedMissions();
  }, [user?.id]);

  // FUNÇÃO PARA MARCAR COMO LIDO E NAVEGAR
  const handleOpenProposedMission = async (mission) => {
    try {
      // Atualiza a proposta que EU fiz para esta missão como lida
      const { error } = await supabase
        .from('proposals')
        .update({ is_read: true })
        .eq('mission_id', mission.id)
        .eq('user_id', user.id) // Garante que estou lendo a MINHA proposta
        .eq('is_read', false);

      if (error) throw error;

      // Navega para os detalhes
      setSelectedMission(mission);
      setPage('detalhes-missao');
    } catch (err) {
      console.error("Erro ao atualizar leitura da proposta:", err.message);
      setSelectedMission(mission);
      setPage('detalhes-missao');
    }
  };

  return (
    <div className="timeline">
      <h2 className="timeline-title">Minhas Propostas</h2>
      <p style={{ marginBottom: '20px', color: '#64748b' }}>
        Estas são as missões onde você ofereceu seus serviços.
      </p>

      {loading ? (
        <div className="empty-msg">Carregando propostas...</div>
      ) : missions.length > 0 ? (
        missions.map((mission) => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            user={user} 
            setPage={setPage} 
            // Interceptamos o clique aqui:
            setSelectedMission={() => handleOpenProposedMission(mission)}
          />
        ))
      ) : (
        <div className="empty-msg">
          <p>Você ainda não fez nenhuma proposta em missões ativas.</p>
          <button className="btn-main-action" onClick={() => setPage('home')}>
            Explorar Missões
          </button>
        </div>
      )}
    </div>
  );
};
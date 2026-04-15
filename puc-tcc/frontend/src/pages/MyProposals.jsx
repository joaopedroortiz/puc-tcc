import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/MissionCard'; // Corrigido para PascalCase

export const MyProposals = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposedMissions = async () => {
      setLoading(true);
      try {
        // Buscamos as propostas do usuário e trazemos os dados da missão vinculada
        const { data, error } = await supabase
          .from('proposals')
          .select(`
            mission_id,
            missions (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        // 1. Criamos um Map para garantir que cada missão seja ÚNICA na lista
        // Isso resolve o erro de "Duplicate Keys" caso você tenha feito 2 propostas para a mesma missão
        const uniqueMissionsMap = new Map();
        
        data.forEach(item => {
          if (item.missions && item.missions.is_active) {
            uniqueMissionsMap.set(item.missions.id, item.missions);
          }
        });

        // 2. Convertemos o Map de volta para um Array
        const activeMissions = Array.from(uniqueMissionsMap.values());

        setMissions(activeMissions);
      } catch (err) {
        console.error("Erro ao carregar propostas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProposedMissions();
  }, [user.id]);

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
            key={mission.id} // Agora o ID é garantido como único pelo Map acima
            mission={mission} 
            user={user} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission}
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
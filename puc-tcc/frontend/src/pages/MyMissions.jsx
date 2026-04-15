import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export const MyMissions = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyMissions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        console.error("Erro:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchMyMissions();
  }, [user.id]);

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
            user={user} // CORRIGIDO: Aqui estava 'session.user', mudei para 'user'
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
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
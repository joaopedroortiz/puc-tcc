
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export const Completed = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      setLoading(true);
      try {
        // Busca missões minhas OU que eu participei que foram finalizadas
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', false)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchCompleted();
  }, [user.id]);

  return (
    <div className="timeline">
      <h2 className="timeline-title">Histórico de Concluídos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : missions.length > 0 ? (
        missions.map(m => (
          <MissionCard key={m.id} mission={m} user={user} setPage={setPage} setSelectedMission={setSelectedMission} />
        ))
      ) : (
        <p className="empty-msg">Nenhuma missão concluída ainda.</p>
      )}
    </div>
  );
};
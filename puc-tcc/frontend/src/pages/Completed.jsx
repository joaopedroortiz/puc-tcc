import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { MissionCard } from '../components/Missioncard';

export const Completed = ({ user, setPage, setSelectedMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // CORREÇÃO: Filtramos por status 'Finalizada' para alinhar com o MissionDetails
        // E incluímos proposals (*) para o MissionCard não bugar
        const { data, error } = await supabase
          .from('missions')
          .select(`
            *,
            proposals (*)
          `)
          .eq('user_id', user.id)
          .eq('status', 'Finalizada') 
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        console.error("Erro ao carregar concluídos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [user?.id]);

  return (
    <div className="timeline">
      <h2 className="timeline-title">Histórico de Concluídos</h2>
      <p style={{ marginBottom: '20px', color: '#64748b' }}>
        Veja aqui todas as missões que você já encerrou.
      </p>

      {loading ? (
        <div className="empty-msg">Carregando histórico...</div>
      ) : missions.length > 0 ? (
        missions.map((m) => (
          <MissionCard 
            key={m.id} 
            mission={m} 
            user={user} 
            setPage={setPage} 
            setSelectedMission={setSelectedMission} 
          />
        ))
      ) : (
        <div className="empty-msg">
          <p>Nenhuma missão concluída ainda.</p>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Missões finalizadas na tela de detalhes aparecerão aqui.
          </span>
        </div>
      )}
    </div>
  );
};
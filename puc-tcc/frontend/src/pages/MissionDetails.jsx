import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProposalModal } from '../components/ProposalModal';

export const MissionDetails = ({ mission, user, setPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalCount, setProposalCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  // Validação: a missão pertence ao usuário logado?
  const isMyMission = user?.id === mission?.user_id;
  // Validação: a missão já foi finalizada?
  const isFinished = mission?.is_active === false;

  useEffect(() => {
    if (!mission?.id) return;

    const fetchProposalCount = async () => {
      try {
        const { count, error } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('mission_id', mission.id);

        if (error) throw error;
        setProposalCount(count || 0);
      } catch (error) {
        console.error("Erro ao procurar propostas:", error.message);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchProposalCount();
  }, [mission?.id]);

  const handleFinalize = async () => {
    const confirm = window.confirm("Deseja realmente finalizar esta missão? Ela será movida para a seção de concluídos.");
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('missions')
        .update({ is_active: false })
        .eq('id', mission.id);

      if (error) throw error;

      alert("Missão finalizada com sucesso!");
      setPage('concluidos'); 
    } catch (error) {
      alert("Erro ao finalizar missão: " + error.message);
    }
  };

  if (!mission) {
    return (
      <div className="details-container" style={{textAlign: 'center', padding: '50px'}}>
        <h2>A carregar detalhes...</h2>
        <button className="btn-secondary-action" onClick={() => setPage('home')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="btn-back-nav" onClick={() => setPage('home')}>
        ← Voltar para a Timeline
      </button>
      
      <div className="details-card">
        <header className="details-header">
          <div className="title-group">
            {isMyMission && <span className="own-mission-tag">SUA MISSÃO</span>}
            {isFinished && <span className="finished-mission-tag">CONCLUÍDA</span>}
            <h1>{mission.title}</h1>
          </div>
        </header>

        <div className="details-body">
          <h3>Descrição da Missão</h3>
          <p className="description-full">{mission.description}</p>
        </div>

        <div className="details-meta-grid">
          <div className="meta-box">
            <span className="meta-label">📍 LOCALIZAÇÃO</span>
            <span className="meta-value">{mission.neighborhood}, {mission.city}</span>
          </div>

          <div className="meta-box">
            <span className="meta-label">💰 VALOR ESTIMADO</span>
            <span className="meta-value">
              {mission.price ? `R$ ${mission.price}` : 'A combinar'}
            </span>
          </div>

          <div className="meta-box">
            <span className="meta-label">📊 ENGAJAMENTO</span>
            <span className="meta-value">
              {loadingCount ? 'A carregar...' : `${proposalCount} propostas feitas`}
            </span>
          </div>
          
          <div className="meta-box">
            <span className="meta-label">🗓️ PUBLICADO EM</span>
            <span className="meta-value">
              {new Date(mission.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        <div className="details-actions">
          {isFinished ? (
            /* Se a missão estiver concluída, não mostra botões de ação */
            <div className="finished-info-box" style={{ textAlign: 'center', width: '100%', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontWeight: '600' }}>Esta missão foi finalizada e não aceita mais propostas ou edições.</p>
            </div>
          ) : isMyMission ? (
            /* Layout para o dono da missão ativa */
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                className="btn-secondary-action" 
                style={{ flex: 1, padding: '15px' }}
                onClick={() => alert("Funcionalidade de editar em breve")}
              >
                ✏️ Editar Missão
              </button>
              <button 
                className="btn-main-action" 
                style={{ flex: 1, padding: '15px', backgroundColor: '#16a34a' }}
                onClick={handleFinalize}
              >
                ✅ Finalizar Missão
              </button>
            </div>
          ) : (
            /* Layout para outros usuários em missão ativa */
            <button 
              className="btn-main-action btn-large" 
              onClick={() => setIsModalOpen(true)}
            >
              Fazer Proposta Agora
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProposalModal 
          missionId={mission.id} 
          user={user} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};
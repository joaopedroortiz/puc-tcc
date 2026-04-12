import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProposalModal } from '../components/ProposalModal';

export const MissionDetails = ({ mission, user, setPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalCount, setProposalCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  // Efeito para carregar a contagem de propostas
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

  // Guarda de renderização: se não houver missão, mostra loading
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
            <h1>{mission.title}</h1>
            <span className="status-badge">{mission.status || 'Aberto'}</span>
          </div>
          <div className="price-tag">
            {mission.price ? `R$ ${mission.price}` : 'Valor a combinar'}
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
          <button 
            className="btn-main-action btn-large" 
            onClick={() => setIsModalOpen(true)}
          >
            Fazer Proposta Agora
          </button>
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
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProposalModal } from '../components/ProposalModal';

export const MissionDetails = ({ mission, user, setPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState([]); // Agora guardamos a lista de propostas
  const [loadingProposals, setLoadingProposals] = useState(true);

  const isMyMission = user?.id === mission?.user_id;
  const isFinished = mission?.is_active === false;

  useEffect(() => {
    if (!mission?.id) return;

    const fetchProposalsData = async () => {
      setLoadingProposals(true);
      try {
        // Buscamos as propostas e os perfis de quem as fez
        const { data, error } = await supabase
          .from('proposals')
          .select(`
            id,
            price,
            message,
            created_at,
            user_id
          `)
          .eq('mission_id', mission.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProposals(data || []);
      } catch (error) {
        console.error("Erro ao carregar propostas:", error.message);
      } finally {
        setLoadingProposals(false);
      }
    };

    fetchProposalsData();
  }, [mission?.id]);

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
        {/* ... (Todo o seu cabeçalho e meta-grid permanecem iguais) ... */}
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
              {proposals.length} propostas feitas
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
            <div className="finished-info-box">
              <p>Esta missão foi finalizada.</p>
            </div>
          ) : isMyMission ? (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn-secondary-action" style={{ flex: 1 }}>✏️ Editar</button>
              <button className="btn-main-action" style={{ flex: 1, backgroundColor: '#16a34a' }}>✅ Finalizar</button>
            </div>
          ) : (
            <button className="btn-main-action btn-large" onClick={() => setIsModalOpen(true)}>
              Fazer Proposta Agora
            </button>
          )}
        </div>
      </div>

      {/* SEÇÃO DE PROPOSTAS RECEBIDAS (Aparece apenas para o dono ou se houver propostas) */}
      <div className="proposals-section" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#1e293b' }}>
          Propostas Recebidas ({proposals.length})
        </h2>

        {loadingProposals ? (
          <p>Carregando propostas...</p>
        ) : proposals.length > 0 ? (
          <div className="proposals-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {proposals.map((prop) => (
              <div key={prop.id} className="proposal-item-card" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#0369a1' }}>Oferta: R$ {prop.price}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(prop.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>"{prop.message}"</p>
                
                {isMyMission && !isFinished && (
                   <button 
                    className="btn-secondary-action" 
                    style={{ marginTop: '15px', padding: '8px 15px', fontSize: '0.85rem' }}
                    onClick={() => alert("Chat com prestador em breve")}
                   >
                     💬 Contatar Prestador
                   </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
            Nenhuma proposta recebida até o momento.
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProposalModal missionId={mission.id} user={user} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
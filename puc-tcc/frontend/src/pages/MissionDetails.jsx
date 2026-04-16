import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProposalModal } from '../components/ProposalModal';

export const MissionDetails = ({ mission, user, setPage, setTargetUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const isMyMission = user?.id === mission?.user_id;
  const isFinished = mission?.is_active === false;

  const fetchProposalsData = async () => {
    setLoadingProposals(true);
    try {
      // 1. ATUALIZADA A QUERY: Agora buscamos os novos campos de empresa do profile
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          id,
          price,
          message,
          created_at,
          user_id,
          status,
          profiles:user_id (
            full_name,
            email,
            phone,
            is_company,
            company_name,
            company_address,
            business_type,
            company_email
          )
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

  useEffect(() => {
    if (mission?.id) fetchProposalsData();
  }, [mission?.id]);

  const handleAcceptProposal = async (proposalId) => {
    const confirm = window.confirm("Deseja aceitar esta proposta? O prestador será notificado.");
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', proposalId);

      if (error) throw error;
      alert("Proposta aceita com sucesso!");
      fetchProposalsData();
    } catch (error) {
      alert("Erro ao aceitar proposta: " + error.message);
    }
  };

  const handleViewProfile = (userId) => {
    setTargetUserId(userId);
    setPage('perfil-publico');
  };

  if (!mission) {
    return (
      <div className="details-container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>A carregar detalhes...</h2>
        <button className="btn-secondary-action" onClick={() => setPage('home')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="btn-back-nav" onClick={() => setPage('home')}>
        ← Home
      </button>

      {/* ... Detalhes da Missão (mantido igual) */}
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
            <div className="finished-info-box" style={{ textAlign: 'center', width: '100%', padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
              <p style={{ color: '#475569', fontWeight: 'bold' }}>MISSÃO FINALIZADA</p>
            </div>
          ) : isMyMission ? (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn-secondary-action" style={{ flex: 1 }}>✏️ Editar</button>
              <button 
                className="btn-main-action" 
                style={{ flex: 1, backgroundColor: '#16a34a' }}
                onClick={() => alert("Use o botão 'Aceitar' em uma proposta abaixo para finalizar.")}
              >
                ✅ Finalizar
              </button>
            </div>
          ) : (
            <button className="btn-main-action btn-large" onClick={() => setIsModalOpen(true)}>
              Fazer Proposta Agora
            </button>
          )}
        </div>
      </div>

      <div className="proposals-section" style={{ marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: '#1e293b' }}>
          Propostas Recebidas ({proposals.length})
        </h2>

        {loadingProposals ? (
          <p>Carregando propostas...</p>
        ) : proposals.length > 0 ? (
          <div className="proposals-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {proposals.map((prop) => {
              // 2. LÓGICA DE EXIBIÇÃO DE EMPRESA NOS CARDS DE LANCE
              const p = prop.profiles;
              const isCompany = p?.is_company;
              
              const displayName = (isCompany && p?.company_name) ? p.company_name : (p?.full_name || 'Usuário');
              const displayEmail = (isCompany && p?.company_email) ? p.company_email : (p?.email || 'E-mail não disponível');

              return (
                <div key={prop.id} className="proposal-item-card" style={{
                  background: prop.status === 'accepted' ? '#f0fdf4' : 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: prop.status === 'accepted' ? '2px solid #22c55e' : '1px solid #e2e8f0',
                  position: 'relative'
                }}>
                  {prop.status === 'accepted' && (
                    <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      ACEITA
                    </span>
                  )}

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewProfile(prop.user_id)}
                        style={{ background: 'none', border: 'none', color: '#0369a1', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', padding: 0, textDecoration: 'underline' }}
                      >
                        👤 {displayName}
                      </button>
                      {isCompany && (
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          EMPRESA
                        </span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                      {isCompany && p?.business_type && (
                        <p style={{ fontWeight: 'bold', color: '#1e293b' }}>🏢 {p.business_type}</p>
                      )}
                      <p>📧 {displayEmail}</p>
                      <p>📞 {p?.phone || 'Telefone não disponível'}</p>
                      {isCompany && p?.company_address && (
                        <p style={{ marginTop: '4px', color: '#475569' }}>📍 {p.company_address}</p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: '#16a34a' }}>Oferta: R$ {prop.price}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {new Date(prop.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                    "{prop.message}"
                  </p>
                  
                  {isMyMission && !isFinished && prop.status !== 'accepted' && (
                     <button 
                      className="btn-main-action" 
                      style={{ marginTop: '15px', width: '100%', backgroundColor: '#0f172a' }}
                      onClick={() => handleAcceptProposal(prop.id)}
                     >
                       🤝 Aceitar Proposta
                     </button>
                  )}
                </div>
              );
            })}
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
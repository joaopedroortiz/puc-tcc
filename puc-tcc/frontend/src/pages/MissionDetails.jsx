import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ProposalModal } from '../components/ProposalModal';

export const MissionDetails = ({ mission, user, setPage, setTargetUserId, setSelectedMission, refreshMissions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const isMyMission = user?.id === mission?.user_id;
  const isFinished = mission?.status === 'Finalizada';

  const fetchProposalsData = async () => {
    setLoadingProposals(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          id, price, message, created_at, user_id, status,
          profiles:user_id (
            full_name, email, phone, is_company,
            company_name, company_address, business_type, company_email
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

  const handleEdit = () => {
    if (setSelectedMission) {
      setSelectedMission(mission);
      setPage('criar-missao');
    }
  };

  const handleFinishMission = async () => {
    if (!window.confirm("Deseja finalizar esta missão agora?")) return;
    try {
      const { error } = await supabase
        .from('missions')
        .update({ status: 'Finalizada' })
        .eq('id', mission.id);

      if (error) throw error;
      alert("Missão finalizada com sucesso! ✅");
      if (refreshMissions) refreshMissions();
      setPage('home');
    } catch (error) {
      alert("Erro ao finalizar: " + error.message);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    const confirm = window.confirm("Deseja aceitar esta proposta? Isso também finalizará sua missão.");
    if (!confirm) return;

    try {
      await supabase.from('proposals').update({ status: 'accepted' }).eq('id', proposalId);
      await supabase.from('missions').update({ status: 'Finalizada' }).eq('id', mission.id);

      alert("Proposta aceita! Missão encerrada. 🤝");
      if (refreshMissions) refreshMissions();
      setPage('home');
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const handleViewProfile = (userId) => {
    setTargetUserId(userId);
    setPage('perfil-publico');
  };

  if (!mission) return <div style={{ padding: '50px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="details-container">
      <button className="btn-back-nav" onClick={() => setPage('home')}>← Voltar para a Home</button>

      <div className="details-card">
        <header className="details-header">
          <div className="title-group">
            {isMyMission && <span className="own-mission-tag" style={{ background: '#0369a1', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', marginRight: '8px' }}>SUA MISSÃO</span>}
            {isFinished && <span className="finished-mission-tag" style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CONCLUÍDA</span>}
            <h1>{mission.title}</h1>
          </div>
        </header>

        <div className="details-body" style={{ marginTop: '20px' }}>
          <h3>Descrição da Missão</h3>
          <p style={{ lineHeight: '1.6', color: '#334155' }}>{mission.description}</p>
          
          {mission.images && mission.images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              {mission.images.map((img, idx) => (
                <img key={idx} src={img} alt="Anexo" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              ))}
            </div>
          )}
        </div>

        <div className="details-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
          <div className="meta-box">
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>📍 LOCALIZAÇÃO</span>
            <span style={{ fontWeight: 'bold' }}>{mission.neighborhood}, {mission.city}</span>
          </div>
          <div className="meta-box">
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>💰 VALOR</span>
            <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{mission.price ? `R$ ${mission.price}` : 'A combinar'}</span>
          </div>
          <div className="meta-box">
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>📊 PROPOSTAS</span>
            <span style={{ fontWeight: 'bold' }}>{proposals.length}</span>
          </div>
        </div>

        <div className="details-actions" style={{ marginTop: '30px' }}>
          {isFinished ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '15px', background: '#f1f5f9', borderRadius: '8px' }}>
              <p style={{ color: '#475569', fontWeight: 'bold', margin: 0 }}>MISSÃO FINALIZADA</p>
            </div>
          ) : isMyMission ? (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button className="btn-secondary-action" style={{ flex: 1 }} onClick={handleEdit}>✏️ Editar</button>
              <button className="btn-main-action" style={{ flex: 1, backgroundColor: '#16a34a' }} onClick={handleFinishMission}>✅ Finalizar</button>
            </div>
          ) : (
            <button className="btn-main-action btn-large" style={{ width: '100%', padding: '15px' }} onClick={() => setIsModalOpen(true)}>Fazer Proposta Agora</button>
          )}
        </div>
      </div>

      <div className="proposals-section" style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Propostas Recebidas ({proposals.length})</h2>

        {loadingProposals ? (
          <p>Carregando propostas...</p>
        ) : proposals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {proposals.map((prop) => {
              const p = prop.profiles;
              const isCompany = p?.is_company;
              const displayName = (isCompany && p?.company_name) ? p.company_name : (p?.full_name || 'Usuário');

              return (
                <div key={prop.id} style={{
                  background: prop.status === 'accepted' ? '#f0fdf4' : 'white',
                  padding: '20px', borderRadius: '12px', border: prop.status === 'accepted' ? '2px solid #22c55e' : '1px solid #e2e8f0', position: 'relative'
                }}>
                  {prop.status === 'accepted' && <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>ACEITA</span>}

                  <div style={{ marginBottom: '10px' }}>
                    <button onClick={() => handleViewProfile(prop.user_id)} style={{ background: 'none', border: 'none', color: '#0369a1', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>
                      👤 {displayName} {isCompany && "(Empresa)"}
                    </button>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>
                        <p>📧 {isCompany ? p.company_email : p.email}</p>
                        <p>📞 {p.phone}</p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold', color: '#16a34a' }}>Oferta: R$ {prop.price}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(prop.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <p style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '0.9rem' }}>"{prop.message}"</p>
                  
                  {isMyMission && !isFinished && prop.status !== 'accepted' && (
                     <button className="btn-main-action" style={{ marginTop: '15px', width: '100%', backgroundColor: '#0f172a' }} onClick={() => handleAcceptProposal(prop.id)}>
                       🤝 Aceitar Proposta
                     </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>Nenhuma proposta ainda.</div>
        )}
      </div>

      {isModalOpen && <ProposalModal missionId={mission.id} user={user} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
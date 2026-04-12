import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './ProfileCard.css';
import userImg from '../assets/user.png';

// --- COMPONENTE DO PERFIL (LATERAL) ---
export const ProfileCard = ({ user, setPage }) => {
  const [profile, setProfile] = useState({ phone: '', region: '', bio: '' });
  const [loading, setLoading] = useState(true);

  const fullName = user?.user_metadata?.full_name || "Usuário";
  const firstName = fullName.split(' ')[0];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('phone, region, bio')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile({
            phone: data.phone || '',
            region: data.region || '',
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadData();
  }, [user]);

  return (
    <aside className="profile-card">
      <div className="profile-header">
        <img src={userImg} alt="Avatar" className="profile-avatar-large" />
        <h3>Olá, {firstName}!</h3>
        <button className="btn-edit-profile" onClick={() => setPage('perfil')}>
          Editar Perfil
        </button>
      </div>

      <div className="profile-stats">
        {loading ? (
          <p>A carregar dados...</p>
        ) : (
          <>
            <div className="stat-item">
              <span className="stat-label">📍 Região</span>
              <span className="stat-value">{profile.region || 'Não informada'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">📱 Contacto</span>
              <span className="stat-value">{profile.phone || 'Não informado'}</span>
            </div>
          </>
        )}
      </div>

      <button className="btn-main-action" style={{width: '100%', marginTop: '15px'}} onClick={() => setPage('criar-missao')}>
        Publicar Missão
      </button>
    </aside>
  );
};

// --- COMPONENTE DE MISSÃO (TIMELINE) ---
export const MissionCard = ({ mission, setPage, setSelectedMission }) => {
  
  const handleAccess = () => {
    setSelectedMission(mission); // Guarda a missão no estado global
    setPage('detalhes-missao');  // Muda para a página de detalhes
  };

  const renderDescription = (text) => {
    if (!text) return "";
    if (text.length <= 220) return text;
    return (
      <>
        {text.substring(0, 220)}...
        <span className="ver-mais" onClick={handleAccess}> ver mais</span>
      </>
    );
  };

  const formatPrice = (value) => {
    if (!value) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="mission-card">
      <div className="mission-header">
        <h3>{mission.title}</h3>
        <span className="status-badge">{mission.status || 'Aberto'}</span>
      </div>

      <p className="mission-card-p">
        {renderDescription(mission.description)}
      </p>

      <div className="mission-footer-container">
        <div className="mission-meta-info">
          <span className="meta-item">📍 {mission.neighborhood || 'Local não informado'}</span>
          <span className="meta-item">💰 {formatPrice(mission.price)}</span>
        </div>

        <div className="mission-footer-buttons">
          <button className="btn-secondary-action" onClick={handleAccess}>
            Aceder
          </button>
          <button className="btn-main-action" onClick={handleAccess}>
            Fazer Proposta
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './PublicProfile.css';

export const PublicProfile = ({ targetUserId, setPage }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Se não houver ID, redireciona para home para evitar erro de tela branca
      if (!targetUserId) {
        setPage('home');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: supabaseError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();

        if (supabaseError) throw supabaseError;
        
        if (!data) {
          setError("Perfil não encontrado.");
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err.message);
        setError("Não foi possível carregar as informações do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId, setPage]);

  if (loading) {
    return (
      <div className="profile-status-container">
        <div className="loader"></div>
        <p>Carregando perfil profissional...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-status-container">
        <h2>⚠️ Ops!</h2>
        <p>{error || "Usuário não localizado."}</p>
        <button className="btn-secondary-action" onClick={() => setPage('home')}>
          Voltar para Início
        </button>
      </div>
    );
  }

  return (
    <div className="public-profile-container">
      <button className="btn-back-nav" onClick={() => setPage('home')}>
        ← Voltar para a Timeline
      </button>

      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {profile.full_name?.charAt(0).toUpperCase() || "U"}
        </div>
        
        <h1 className="profile-name">{profile.full_name}</h1>
        <span className="profile-badge">Prestador Verificado</span>
        
        <div className="profile-info-grid">
          <div className="info-item">
            <span className="info-label">📧 E-MAIL</span>
            <span className="info-value">{profile.email}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">📞 TELEFONE / WHATSAPP</span>
            <span className="info-value">
              {profile.phone || "Não cadastrado"}
            </span>
          </div>
        </div>

        <div className="profile-bio-section">
          <h3>Sobre o Prestador</h3>
          <p>
            {profile.bio || "Este usuário ainda não adicionou uma descrição ao seu perfil profissional."}
          </p>
        </div>

        <div className="profile-footer-notice">
          <p>As informações de contato são de responsabilidade do prestador.</p>
          <button 
            className="btn-main-action" 
            onClick={() => window.open(`https://wa.me/${profile.phone?.replace(/\D/g, '')}`, '_blank')}
            disabled={!profile.phone}
          >
            💬 Abrir WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './ProfileCard.css';
import userImg from '../assets/user.png';

export const ProfileCard = ({ user, setPage }) => {
  // Estado ampliado para incluir os campos de empresa
  const [profile, setProfile] = useState({ 
    phone: '', 
    region: '', 
    bio: '',
    is_company: false,
    company_name: '',
    company_address: '',
    business_type: '',
    company_email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*') // Buscamos todos os campos novos
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadData();
  }, [user]);

  // LÓGICA DE EXIBIÇÃO PRIORITÁRIA
  // Se for empresa e tiver nome, usa o nome da empresa. Senão, usa o nome do usuário.
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const displayName = (profile.is_company && profile.company_name) 
    ? profile.company_name 
    : fullName;

  const displayEmail = (profile.is_company && profile.company_email)
    ? profile.company_email
    : user.email;

  return (
    <aside className="profile-card">
      <div className="profile-header">
        <img src={userImg} alt="Avatar" className="profile-avatar-large" />
        {/* Mostra o nome da empresa ou "Olá, [Primeiro Nome]" */}
        <h3>{profile.is_company ? displayName : `Olá, ${displayName.split(' ')[0]}!`}</h3>
        
        {profile.is_company && (
          <span className="badge-company">🏢 Estabelecimento</span>
        )}
      </div>

      <div className="profile-stats">
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            {/* Se for empresa, mostramos o Ramo e o Endereço específico */}
            {profile.is_company ? (
              <div className="company-info-box">
                <div className="stat-item">
                  <span className="stat-label">🛠️ Ramo: </span>
                  <span className="stat-value">{profile.business_type || 'Não informado'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">📍 Endereço: </span>
                  <span className="stat-value">{profile.company_address || 'Não informado'}</span>
                </div>
              </div>
            ) : (
              <div className="stat-item">
                <span className="stat-label">📍 Região: </span>
                <span className="stat-value">{profile.region || 'Não informada'}</span>
              </div>
            )}

            <div className="stat-item">
              <span className="stat-label">📧 E-mail: </span>
              <span className="stat-value">{displayEmail}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">📱 Contato: </span>
              <span className="stat-value">{profile.phone || 'Não informado'}</span>
            </div>
          </>
        )}
        
        <button className="btn-edit-profile" onClick={() => setPage('perfil')}>
          Editar Perfil
        </button>
      </div>
    </aside>
  );
};
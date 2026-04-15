import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './ProfileCard.css';
import userImg from '../assets/user.png';

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
      </div>

      <div className="profile-stats">
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            <div className="stat-item">
              <span className="stat-label">📍 Região: </span>
              <span className="stat-value">{profile.region || 'Não informada'}</span>
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
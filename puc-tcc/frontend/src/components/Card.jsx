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
      setLoading(false);
    };

    if (user?.id) loadData();
  }, [user]);

  // Lógica para verificar se o perfil está incompleto
  const isProfileIncomplete = !profile.phone && !profile.region && !profile.bio;

  return (
    <aside className="profile-card">
      <div className="profile-header">
        <img src={userImg} alt="Avatar" className="profile-avatar-large" />
        <h3>{firstName}</h3>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-info-display">
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>Carregando...</p>
        ) : isProfileIncomplete ? (
          /* Mensagem exibida caso não haja dados extras */
          <div className="incomplete-profile-msg">
            <p>⚠️ Complete seu perfil para passar mais confiança!</p>
          </div>
        ) : (
          /* Exibe os dados se algum deles existir */
          <>
            {profile.phone && <p><strong>Tel:</strong> {profile.phone}</p>}
            {profile.region && <p><strong>Região:</strong> {profile.region}</p>}
            {profile.bio && <p className="profile-bio-text">"{profile.bio}"</p>}
          </>
        )}
      </div>
      
      <button className="btn-edit-nav" onClick={() => setPage('perfil')}>
        {isProfileIncomplete ? 'Completar Perfil' : 'Editar Perfil'}
      </button>
    </aside>
  );
};
import React from 'react';
import './ProfileCard.css';
import userImg from '../assets/user.png';

export const ProfileCard = ({ user }) => {
  // Pega apenas o primeiro nome do Google (metadata)
  const fullName = user?.user_metadata?.full_name || "Usuário";
  const firstName = fullName.split(' ')[0];
  const email = user?.email;

  return (
    <aside className="profile-card">
      <div className="profile-header">
        <img src={userImg} alt="Avatar" className="profile-avatar-large" />
        <h3>Olá, {firstName}!</h3>
        <p className="profile-email">{email}</p>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <label>Telefone</label>
          <input type="text" placeholder="(51) 99999-9999" />
        </div>
        <div className="detail-item">
          <label>Região</label>
          <input type="text" placeholder="Ex: Zona Sul, Porto Alegre" />
        </div>
        <div className="detail-item">
          <label>Descrição</label>
          <textarea placeholder="Conte um pouco sobre suas habilidades..." rows="3"></textarea>
        </div>
      </div>
      
      <button className="btn-save-profile">Atualizar Perfil</button>
    </aside>
  );
};
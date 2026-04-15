import React from 'react';

// Adicionamos a prop 'user' para saber quem está logado
export const MissionCard = ({ mission, user, setPage, setSelectedMission }) => {
  
  // Verifica se o usuário logado é o dono da missão
  const isMyMission = user?.id === mission?.user_id;

  const handleAccess = () => {
    if (setSelectedMission) {
      setSelectedMission(mission);
    }
    setPage('detalhes-missao');
  };

  const renderDescription = (text) => {
    if (!text) return "";
    if (text.length <= 220) return text;
    return (
      <>
        {text.substring(0, 220)}...
        <span 
          className="ver-mais" 
          onClick={handleAccess} 
          style={{cursor: 'pointer', color: '#0369a1', fontWeight: 'bold'}}
        > 
          ver mais
        </span>
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
        {/* Adiciona um pequeno indicador visual no card da timeline também */}
        <h3>
          {mission.title} 
          {isMyMission && <span style={{fontSize: '0.6rem', marginLeft: '8px', color: '#0369a1', verticalAlign: 'middle'}}>(Sua)</span>}
        </h3>
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
            Acessar
          </button>
          
          {/* Lógica do botão de proposta */}
          <button 
            className="btn-main-action" 
            onClick={handleAccess}
            disabled={isMyMission}
            style={isMyMission ? { backgroundColor: '#cbd5e1', cursor: 'not-allowed', opacity: 0.7 } : {}}
          >
            {isMyMission ? 'Sua Missão' : 'Fazer Proposta'}
          </button>
        </div>
      </div>
    </div>
  );
};
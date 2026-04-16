import React, { useState } from 'react';

export const MissionCard = ({ mission, user, setPage, setSelectedMission }) => {
  // Estados para o carrossel
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMyMission = user?.id === mission?.user_id;
  const numProposals = mission.proposals?.length || 0;
  const hasImages = mission.images && mission.images.length > 0;

  const handleAccess = () => {
    if (setSelectedMission) {
      setSelectedMission(mission);
    }
    setPage('detalhes-missao');
  };

  // Funções de navegação do carrossel
  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mission.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mission.images.length) % mission.images.length);
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
      <div className="mission-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3>
          {mission.title} 
          {isMyMission && <span style={{fontSize: '0.6rem', marginLeft: '8px', color: '#0369a1', verticalAlign: 'middle'}}>(Sua)</span>}
        </h3>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* BOTÃO VER IMAGENS: Adicionado conforme solicitado */}
          {hasImages && (
            <button 
              onClick={() => { setCurrentIndex(0); setShowCarousel(true); }}
              style={{
                background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px',
                padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              🖼️ Fotos ({mission.images.length})
            </button>
          )}

          {isMyMission && numProposals > 0 && (
            <div className="proposals-badge-card" title={`${numProposals} propostas recebidas`}>
              📩 {numProposals}
            </div>
          )}
        </div>
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

      {/* OVERLAY DO CARROSSEL: Adicionado conforme solicitado */}
      {showCarousel && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex',
            justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setShowCarousel(false)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Botão Fechar (X) */}
            <button 
              onClick={() => setShowCarousel(false)}
              style={{
                position: 'absolute', top: '-40px', right: 0, background: 'none',
                border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer'
              }}
            >
              &times;
            </button>

            {/* Setas de Navegação */}
            {mission.images.length > 1 && (
              <>
                <button 
                  onClick={prevImg}
                  style={{
                    position: 'absolute', left: '-50px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer'
                  }}
                >
                  &#8249;
                </button>
                <button 
                  onClick={nextImg}
                  style={{
                    position: 'absolute', right: '-50px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer'
                  }}
                >
                  &#8250;
                </button>
              </>
            )}

            <img 
              src={mission.images[currentIndex]} 
              alt="Anexo da missão"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            />
            
            <div style={{ color: 'white', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
              {currentIndex + 1} / {mission.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
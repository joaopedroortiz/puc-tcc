import React, { useState } from 'react';

export const MissionCard = ({ mission, user, setPage, setSelectedMission }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMyMission = user?.id === mission?.user_id;
  const isFinished = mission.status === 'Finalizada';
  const numProposals = mission.proposals?.length || 0;
  const hasImages = mission.images && mission.images.length > 0;

  const handleAccess = () => {
    if (setSelectedMission) setSelectedMission(mission);
    setPage('detalhes-missao');
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mission.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mission.images.length) % mission.images.length);
  };

  return (
    <div className={`mission-card ${isFinished ? 'mission-finished' : ''}`} style={isFinished ? { opacity: 0.8 } : { position: 'relative' }}>
      <div className="mission-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3>
          {mission.title} 
          {isMyMission && <span style={{fontSize: '0.6rem', marginLeft: '8px', color: '#0369a1', verticalAlign: 'middle'}}>(Sua)</span>}
          {isFinished && <span style={{fontSize: '0.6rem', marginLeft: '8px', color: '#10b981', verticalAlign: 'middle'}}>[FINALIZADA]</span>}
        </h3>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {hasImages && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setCurrentIndex(0); 
                setShowCarousel(true); 
              }}
              className="btn-photos-preview"
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              🖼️ Fotos ({mission.images.length})
            </button>
          )}

          {isMyMission && numProposals > 0 && (
            <div className="proposals-badge-card">📩 {numProposals}</div>
          )}
        </div>
      </div>

      <p className="mission-card-p">
        {mission.description?.length > 220 ? `${mission.description.substring(0, 220)}...` : mission.description}
      </p>

      <div className="mission-footer-container">
        <div className="mission-meta-info" style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#64748b' }}>
          <span>📍 {mission.neighborhood || 'Local'}</span>
          <span style={{ marginLeft: '10px' }}>💰 {mission.price ? `R$ ${mission.price}` : 'A combinar'}</span>
        </div>

        <div className="mission-footer-buttons" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary-action" style={{ flex: 1 }} onClick={handleAccess}>
            Acessar
          </button>
          
          <button 
            className="btn-main-action" 
            style={{ 
                flex: 1, 
                backgroundColor: isMyMission ? '#cbd5e1' : (isFinished ? '#94a3b8' : ''),
                cursor: (isMyMission || isFinished) ? 'not-allowed' : 'pointer' 
            }} 
            onClick={handleAccess}
            disabled={isMyMission || isFinished}
          >
            {isMyMission ? 'Sua Missão' : (isFinished ? 'Encerrada' : 'Fazer Proposta')}
          </button>
        </div>
      </div>

      {/* MODAL CARROSSEL CORRIGIDO */}
      {showCarousel && (
        <div 
          className="carousel-overlay" 
          onClick={(e) => {
            e.stopPropagation();
            setShowCarousel(false);
          }}
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, // Garante que fique acima de tudo
            cursor: 'default'
          }}
        >
          <div 
            className="carousel-content" 
            onClick={e => e.stopPropagation()} 
            style={{ position: 'relative', maxWidth: '90%', maxHeight: '80%' }}
          >
            <img 
              src={mission.images[currentIndex]} 
              alt="Preview" 
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} 
            />
            
            <button 
              onClick={() => setShowCarousel(false)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>

            {mission.images.length > 1 && (
              <>
                <button onClick={prevImg} style={{ ...arrowStyle, left: '-50px' }}>❮</button>
                <button onClick={nextImg} style={{ ...arrowStyle, right: '-50px' }}>❯</button>
              </>
            )}

            <p style={{ color: 'white', textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>
              {currentIndex + 1} / {mission.images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const arrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'rgba(255,255,255,0.2)',
  color: 'white',
  border: 'none',
  fontSize: '2rem',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.2s'
};
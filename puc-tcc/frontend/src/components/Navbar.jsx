import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import './Header.css';

import logoImg from '../assets/wtd.svg';
import userImg from '../assets/user.png';
import localImg from '../assets/local.png';

export const Navbar = ({ city, setCity, setPage, page, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [counts, setCounts] = useState({ missoes: 0, propostas: 0 });

  const cities = ['Porto Alegre', 'Canoas', 'Novo Hamburgo', 'Pelotas', 'Caxias do Sul', 'Santa Maria'];

  useEffect(() => {
    if (!user?.id) return;

    const fetchCounts = async () => {
      try {
        // 1. Notificações para o DONO da missão (Propostas recebidas e não lidas)
        const { data: myActiveMissions } = await supabase
          .from('missions')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true);

        const missionIds = myActiveMissions?.map(m => m.id) || [];
        let countNaoLidasRecebidas = 0;

        if (missionIds.length > 0) {
          const { count, error: err1 } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .in('mission_id', missionIds)
            .neq('user_id', user.id) // Propostas de outros usuários
            .eq('is_read', false); // Apenas as que eu não vi

          if (!err1) countNaoLidasRecebidas = count || 0;
        }

        // 2. Notificações para o PRESTADOR (Propostas enviadas e não lidas)
        // AJUSTE: Agora filtramos por is_read: false também para as enviadas
        const { count: countNaoLidasEnviadas, error: err2 } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id) // Propostas que EU fiz
          .eq('is_read', false); // Que eu ainda não limpei/vi o retorno

        setCounts({
          missoes: countNaoLidasRecebidas,
          propostas: countNaoLidasEnviadas || 0
        });
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchCounts();
  }, [user?.id, page]); 

  const navigateTo = (pageName) => {
    setPage(pageName);
    setIsDropdownOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <span className='logo-button'>WTD</span>
        </div>

        <div className="header-right">
          {page === 'home' && (
            <>
              <button className="btn-create-mission" onClick={() => setPage('criar-missao')}>
                + Nova Missão
              </button>
              <div className="location-group">
                <img src={localImg} alt="Local" className="icon-local" />
                <select className="city-dropdown" value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="user-menu-container">
            {(counts.missoes + counts.propostas > 0) && <div className="global-notif-dot"></div>}
            
            <img 
              src={userImg} 
              alt="Usuário" 
              className="user-avatar" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ cursor: 'pointer' }}
            />
            
            {isDropdownOpen && (
              <div className="custom-dropdown">
                <ul>
                  <li onClick={() => navigateTo('home')} className="home-item">
                    <span>Home</span>
                  </li>
                  <li onClick={() => navigateTo('perfil')}>Meu Perfil</li>
                  
                  <li onClick={() => navigateTo('minhas-missoes')} className="li-with-badge">
                    Minhas Missões
                    {counts.missoes > 0 && <span className="notif-counter">{counts.missoes}</span>}
                  </li>

                  <li onClick={() => navigateTo('minhas-propostas')} className="li-with-badge">
                    Minhas Propostas
                    {counts.propostas > 0 && <span className="notif-counter">{counts.propostas}</span>}
                  </li>

                  <li onClick={() => navigateTo('concluidos')}>Concluídos</li>
                  <li className="logout-opt" onClick={() => supabase.auth.signOut()}>Sair</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
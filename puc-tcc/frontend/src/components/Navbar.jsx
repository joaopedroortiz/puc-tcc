import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Header.css';

// Importação das imagens
import logoImg from '../assets/wtd.svg';
import userImg from '../assets/user.png';
import localImg from '../assets/local.png';

// Adicionada a prop 'page' para controle de exibição
export const Navbar = ({ city, setCity, setPage, page }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lista de cidades do Rio Grande do Sul
  const cities = ['Porto Alegre', 'Canoas', 'Novo Hamburgo', 'Pelotas', 'Caxias do Sul', 'Santa Maria'];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erro ao sair:", error.message);
  };

  const navigateTo = (pageName) => {
    setPage(pageName);
    setIsDropdownOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        
        {/* Lado Esquerdo: Logo - Clicar no logo volta para a Home */}
        <div className="header-left" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <img src={logoImg} alt="Mission-Based Work" className="logo-img" />
        </div>

        {/* Lado Direito: Localização e Perfil */}
        <div className="header-right">
          
          {/* LÓGICA: Só exibe o botão e a localização se a página for 'home' */}
          {page === 'home' && (
            <>
              <button 
                className="btn-create-mission" 
                onClick={() => setPage('criar-missao')}
              >
                + Nova Missão
              </button>

              <div className="location-group">
                <img src={localImg} alt="Local" className="icon-local" />
                <select 
                  className="city-dropdown" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Menu do Usuário - Disponível em todas as páginas */}
          <div className="user-menu-container">
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
                  <li onClick={() => navigateTo('perfil')}>Meu Perfil</li>
                  <li onClick={() => navigateTo('minhas-missoes')}>Minhas Missões</li>
                  <li onClick={() => navigateTo('minhas-propostas')}>Minhas Propostas</li>
                  <li onClick={() => navigateTo('concluidos')}>Concluídos</li>
                  <li className="logout-opt" onClick={handleLogout}>Sair</li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
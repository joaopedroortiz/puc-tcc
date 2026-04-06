import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import './Header.css';

// Importação das imagens conforme solicitado
import logoImg from '../assets/wtd.svg';
import userImg from '../assets/user.png';
import localImg from '../assets/local.png';

export const Navbar = ({ city, setCity, setPage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lista de cidades do Rio Grande do Sul
  const cities = ['Porto Alegre', 'Canoas', 'Novo Hamburgo', 'Pelotas', 'Caxias do Sul', 'Santa Maria'];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erro ao sair:", error.message);
  };

  // Função auxiliar para navegar e fechar o menu simultaneamente
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
          
          {/* Bloco de Localização */}
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

          {/* Menu do Usuário */}
          <div className="user-menu-container">
            <img 
              src={userImg} 
              alt="Usuário" 
              className="user-avatar" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
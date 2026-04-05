import React from 'react';
import { supabase } from '../services/supabaseClient';
import './Login.css';
import logoImg from '../assets/wtd.png';

export function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Redireciona para a Home após o login
      }
    });
    if (error) console.error("Erro no login:", error.message);
  };

  return (
    <div className="login-wrapper">
      <div className="login-modal">
        <header className="login-header">
          <img src={logoImg} alt="Mission-Based Work" className="login-logo" />
        </header>

        <section className="login-body">
          <h2>Bem-vindo ao Work To Do</h2>
          <p>
            Somos uma plataforma de intermediação de serviços, conectando profissionais prestadores de serviço a pessoas interessadas. 
            Encontre profissionais qualificados ou monetize suas habilidades de forma ágil e segura.
          </p>
        </section>

        <footer className="login-footer">
          <button className="btn-google" onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
            Entrar com Google
          </button>
        </footer>
      </div>
    </div>
  );
}
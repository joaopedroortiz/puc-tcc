import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  // Estado 1: Armazena a sessão (quem é o usuário logado)
  const [session, setSession] = useState(null);
  
  // Estado 2: Armazena a cidade escolhida no cabeçalho
  // Começamos com 'Porto Alegre' por ser sua base principal
  const [city, setCity] = useState('Porto Alegre');

  useEffect(() => {
    // Ação A: Verifica se o usuário já estava logado antes (cookie/localStorage)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Ação B: Monitora o estado em tempo real. 
    // Se o usuário clicar em "Login" ou "Sair", esse 'ouvinte' atualiza o App na hora.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpeza: Evita vazamento de memória ao fechar a aplicação
    return () => subscription.unsubscribe();
  }, []);

  // Lógica de Roteamento Simples:
  // Se 'session' for nulo, o usuário vê APENAS a tela de Login (Modal Bege)
  if (!session) {
    return <Login />;
  }

  // Se houver uma 'session', o usuário vê a aplicação completa
  return (
    <div className="app-main-wrapper">
      {/* PROPS: Passamos 'city' e 'setCity' para o Navbar.
        O Navbar vai usar 'city' para mostrar a cidade atual e 
        'setCity' para mudar o valor quando você escolher outra no dropdown.
      */}
      <Navbar city={city} setCity={setCity} />
      
      {/* O AppContainer centraliza o conteúdo conforme seu index.css
      */}
      <main className="app-container">
        {/* A Home recebe 'city'. Sempre que o valor mudar lá no topo, 
          a Home "percebe" e faz um novo SELECT no Supabase filtrando pela nova cidade.
        */}
        <Home city={city} />
      </main>
    </div>
  );
}

export default App;
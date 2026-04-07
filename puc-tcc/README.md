# Work To Do - Marketplace de Missões

O **Work To Do** é uma plataforma Full Stack de intermediação de serviços baseada em lances competitivos. O objetivo é conectar contratantes (que publicam "missões") a prestadores de serviço de forma rápida, transparente e localizada.

## 🚀 Tecnologias Utilizadas

* [cite_start]**Front-end:** React.js, Vite, CSS3 (Variáveis nativas e Flexbox). [cite: 2]
* [cite_start]**Backend-as-a-Service:** Supabase (PostgreSQL, Auth, RLS). [cite: 2]
* **Autenticação:** Google OAuth 2.0.

## 🛠️ Funcionalidades

- [cite_start]**Dashboard de Missões:** Listagem dinâmica filtrada por cidade. [cite: 2]
- **Gestão de Perfil:** Sistema de completude de perfil para aumentar a confiabilidade.
- **Lances em Tempo Real:** Usuários podem ofertar propostas para missões abertas.
- **Segurança:** Políticas de *Row Level Security* (RLS) garantem que apenas o dono do perfil edite seus dados.

## 📦 Como rodar o projeto

1. Clone o repositório:
  
gh repo clone joaopedroortiz/puc-tcc

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente

Crie um arquivo .env na raiz e adicione suas chaves do Supabase:

VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
Inicie o servidor de desenvolvimento:

4. Rode a Aplicação

npm run dev
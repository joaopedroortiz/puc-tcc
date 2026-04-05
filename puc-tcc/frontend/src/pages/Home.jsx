import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export function Home() {
  const [missions, setMissions] = useState([])
  const [city, setCity] = useState('Porto Alegre') // Cidade inicial
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Lista de cidades para o dropdown (exemplo RS)
  const cities = ['Porto Alegre', 'Canoas', 'Novo Hamburgo', 'Pelotas', 'Caxias do Sul', 'Santa Maria']

  // Função para buscar missões no Supabase
  const fetchMissions = async () => {
    setLoading(true)
    let query = supabase
      .from('missions')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .eq('city', city) // Filtro de Cidade
      .order('created_at', { ascending: false }) // Ordem Cronológica

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`) // Busca por texto no título
    }

    const { data, error } = await query
    
    if (error) console.error("Erro ao buscar:", error)
    else setMissions(data)
    setLoading(false)
  }

  // Executa a busca sempre que a cidade mudar
  useEffect(() => {
    fetchMissions()
  }, [city])

  return (
    <div className="home-container">
      {/* 1. Cabeçalho e Busca */}
      <header className="home-header">
        <h1>Mission-Based Work</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="O que você precisa?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={fetchMissions}>Pesquisar</button>
        </div>
      </header>

      {/* 2. Timeline (Resultados) */}
      <section className="timeline">
        <h2>Missões em {city}</h2>
        
        {loading ? (
          <p>Carregando missões...</p>
        ) : missions.length > 0 ? (
          missions.map(mission => (
            <div key={mission.id} className="mission-card">
              <div className="mission-header">
                <h3>{mission.title}</h3>
                <span className="status-badge">{mission.status}</span>
              </div>
              <p>{mission.description}</p>
              <div className="mission-footer">
                <small>Postado por: {mission.profiles?.full_name || 'Usuário'}</small>
                <button className="btn-proposta">Enviar Proposta</button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-msg">Nenhuma missão encontrada para esta busca em {city}.</p>
        )}
      </section>
    </div>
  )
}
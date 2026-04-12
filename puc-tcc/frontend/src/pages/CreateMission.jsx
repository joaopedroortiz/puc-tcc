import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const CreateMission = ({ user, currentCity, setPage }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: currentCity,
    neighborhood: '',
    expected_value: '',
    deadline: ''
  });

  const handlePublish = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('missions')
        .insert([{
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          city: formData.city,
          neighborhood: formData.neighborhood,
          price: formData.expected_value || null,
          deadline: formData.deadline || null,
          status: 'Aberto'
        }]);

      if (error) throw error;
      
      alert("🚀 Missão publicada com sucesso!");
      
      setFormData({
        title: '',
        description: '',
        city: currentCity,
        neighborhood: '',
        expected_value: '',
        deadline: ''
      });

      setPage('home'); 
    } catch (error) {
      alert("Erro ao publicar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>🚀 Nova Missão</h2>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
          Preencha os detalhes abaixo para encontrar ajuda.
        </p>
        
        <form onSubmit={handlePublish}>
          <div className="input-group">
            <label>Título</label>
            <input 
              required
              type="text" 
              maxLength={120}
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Pintura de fachada" 
            />
            <small className="char-counter">
              {formData.title.length} / 120 caracteres
            </small>
          </div>

          <div className="input-group">
            <label>Descrição</label>
            <textarea 
              required
              rows="5"
              maxLength={750}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detalhe o que você precisa..." 
            />
            <small className="char-counter">
              {formData.description.length} / 750 caracteres
            </small>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Cidade</label>
              <select 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              >
                <option value="Porto Alegre">Porto Alegre</option>
                <option value="Canoas">Canoas</option>
                <option value="Novo Hamburgo">Novo Hamburgo</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Bairro</label>
              <input 
                required
                type="text" 
                value={formData.neighborhood}
                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                placeholder="Ex: Moinhos de Vento" 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Valor Esperado (Opcional)</label>
              <input 
                type="number" 
                value={formData.expected_value}
                onChange={e => setFormData({...formData, expected_value: e.target.value})}
                placeholder="R$ 0,00" 
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Data Limite (Opcional)</label>
              <input 
                type="date" 
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn-secondary-action" 
              onClick={() => setPage('home')}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={`btn-cta ${loading ? 'btn-loading' : ''}`} 
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading ? (
                <span className="spinner-text">Publicando...</span>
              ) : (
                "Publicar Missão"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
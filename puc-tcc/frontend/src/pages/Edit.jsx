import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({ phone: '', region: '', bio: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setFormData({ phone: data.phone || '', region: data.region || '', bio: data.bio || '' });
    }
    getProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.from('profiles').update(formData).eq('id', user.id);
    setLoading(false);
    if (!error) alert("Perfil salvo!");
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Editar Meu Perfil</h2>
        <div className="input-group">
          <label>Telefone de Contato</label>
          <input 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            placeholder="(51) 99999-9999"
          />
        </div>
        <div className="input-group">
          <label>Região / Cidade</label>
          <input 
            value={formData.region} 
            onChange={e => setFormData({...formData, region: e.target.value})} 
            placeholder="Ex: Bom Fim, Porto Alegre"
          />
        </div>
        <div className="input-group">
          <label>Descrição Profissional (Bio)</label>
          <textarea 
            value={formData.bio} 
            onChange={e => setFormData({...formData, bio: e.target.value})} 
            rows="5"
          />
        </div>
        <button className="btn-cta" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};
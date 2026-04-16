import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

// Adicionamos setPage aqui para permitir a navegação após salvar
export const EditProfile = ({ user, setPage }) => {
  const [formData, setFormData] = useState({ 
    phone: '', 
    region: '', 
    bio: '',
    is_company: false,
    company_name: '',
    company_address: '',
    business_type: '',
    company_email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setFormData({ 
          phone: data.phone || '', 
          region: data.region || '', 
          bio: data.bio || '',
          is_company: data.is_company || false,
          company_name: data.company_name || '',
          company_address: data.company_address || '',
          business_type: data.business_type || '',
          company_email: data.company_email || ''
        });
      }
    }
    getProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update(formData).eq('id', user.id);
      
      if (error) throw error;

      alert("Perfil salvo com sucesso!");
      
      // REDIRECIONAMENTO AUTOMÁTICO PARA A HOME
      setPage('home'); 

    } catch (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Editar Meu Perfil</h2>

        <div className="input-group checkbox-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="checkbox" 
            id="is_company"
            checked={formData.is_company} 
            onChange={e => setFormData({...formData, is_company: e.target.checked})}
            style={{ width: 'auto' }}
          />
          <label htmlFor="is_company" style={{ marginBottom: 0, cursor: 'pointer' }}>
            Você é uma empresa e pode receber clientes no seu estabelecimento?
          </label>
        </div>

        {formData.is_company && (
          <div className="company-section" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#1e293b' }}>Dados Empresariais</h3>
            
            <div className="input-group">
              <label>Nome da Empresa</label>
              <input 
                value={formData.company_name} 
                onChange={e => setFormData({...formData, company_name: e.target.value})} 
                placeholder="Nome fantasia"
              />
            </div>

            <div className="input-group">
              <label>Endereço da Empresa</label>
              <input 
                value={formData.company_address} 
                onChange={e => setFormData({...formData, company_address: e.target.value})} 
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="input-group">
              <label>Ramo de Atuação</label>
              <input 
                value={formData.business_type} 
                onChange={e => setFormData({...formData, business_type: e.target.value})} 
                placeholder="Ex: Manutenção, Estética, Petshop"
              />
            </div>

            <div className="input-group">
              <label>E-mail Empresarial (Opcional)</label>
              <input 
                value={formData.company_email} 
                onChange={e => setFormData({...formData, company_email: e.target.value})} 
                placeholder={user.email}
              />
            </div>
          </div>
        )}

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
            placeholder="Conte um pouco sobre sua experiência..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-cta" onClick={handleSave} disabled={loading} style={{ flex: 2 }}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={() => setPage('home')}
            style={{ flex: 1, backgroundColor: '#cbd5e1', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const CreateMission = ({ user, currentCity, setPage }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Novo: armazena os arquivos de foto
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: currentCity,
    neighborhood: '',
    expected_value: '',
    deadline: ''
  });

  // --- FUNÇÕES DE GERENCIAMENTO DE IMAGENS ---
  const handleFileChange = (files) => {
    const selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (images.length + selectedFiles.length > 5) {
      alert("Você pode adicionar no máximo 5 fotos.");
      return;
    }
    setImages(prev => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async () => {
    const uploadedUrls = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      // Organiza por ID de usuário para manter o Storage limpo
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mission_photos')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('mission_photos').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      } else {
        console.error("Erro no upload:", uploadError.message);
      }
    }
    return uploadedUrls;
  };

  // --- LÓGICA DE PUBLICAÇÃO ---
  const handlePublish = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // 1. Upload das fotos antes de criar a missão
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImagesToStorage();
      }

      // 2. Inserção no banco
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
          status: 'Aberto',
          images: imageUrls // Array de URLs
        }]);

      if (error) throw error;
      
      alert("🚀 Missão publicada com sucesso!");
      
      setFormData({
        title: '', description: '', city: currentCity,
        neighborhood: '', expected_value: '', deadline: ''
      });
      setImages([]);
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
          
          {/* ÁREA DE FOTOS (DRAG & DROP) */}
          <div className="input-group">
            <label>Fotos da Missão (Máx. 5)</label>
            <div 
              className="drag-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById('file-input').click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'all 0.2s'
              }}
            >
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                📸 <strong>Arraste fotos aqui</strong> ou clique para selecionar
              </p>
              <input 
                type="file" 
                id="file-input" 
                multiple 
                accept="image/*" 
                hidden 
                onChange={(e) => handleFileChange(e.target.files)} 
              />
            </div>

            {/* PREVIEW DAS FOTOS */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {images.map((file, index) => (
                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                  />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                    style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      background: '#ef4444', color: 'white', border: 'none',
                      borderRadius: '50%', width: '22px', height: '22px', 
                      cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>

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
                className="city-dropdown"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              >
                <option value="Porto Alegre">Porto Alegre</option>
                <option value="Canoas">Canoas</option>
                <option value="Novo Hamburgo">Novo Hamburgo</option>
                <option value="Pelotas">Pelotas</option>
                <option value="Caxias do Sul">Caxias do Sul</option>
                <option value="Santa Maria">Santa Maria</option>
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
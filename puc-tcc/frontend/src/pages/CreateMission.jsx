import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const CreateMission = ({ user, currentCity, setPage, selectedMission, setSelectedMission }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Armazena novos arquivos (File objects)
  const [existingImages, setExistingImages] = useState([]); // Armazena URLs de imagens que já estão no banco
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: currentCity,
    neighborhood: '',
    expected_value: '',
    deadline: ''
  });

  // --- LÓGICA DE EDIÇÃO: Preenche o form se houver selectedMission ---
  useEffect(() => {
    if (selectedMission) {
      setFormData({
        title: selectedMission.title || '',
        description: selectedMission.description || '',
        city: selectedMission.city || currentCity,
        neighborhood: selectedMission.neighborhood || '',
        expected_value: selectedMission.price || '',
        deadline: selectedMission.deadline || ''
      });
      setExistingImages(selectedMission.images || []);
    }
  }, [selectedMission, currentCity]);

  const handleFileChange = (files) => {
    const selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    // Soma imagens novas + imagens que já existiam
    if (images.length + existingImages.length + selectedFiles.length > 5) {
      alert("Você pode adicionar no máximo 5 fotos.");
      return;
    }
    setImages(prev => [...prev, ...selectedFiles]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async () => {
    const uploadedUrls = [];
    for (const file of images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('mission_photos')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('mission_photos').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }
    return uploadedUrls;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1. Sobe as novas fotos (se houver)
      const newImageUrls = await uploadImagesToStorage();
      // 2. Mescla com as URLs das fotos que o usuário não removeu
      const finalImageUrls = [...existingImages, ...newImageUrls];

      const missionData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        city: formData.city,
        neighborhood: formData.neighborhood,
        price: formData.expected_value || null,
        deadline: formData.deadline || null,
        status: selectedMission ? selectedMission.status : 'Aberto',
        images: finalImageUrls
      };

      let error;
      if (selectedMission) {
        // MODO EDIÇÃO (UPDATE)
        const { error: updateError } = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', selectedMission.id);
        error = updateError;
      } else {
        // MODO CRIAÇÃO (INSERT)
        const { error: insertError } = await supabase
          .from('missions')
          .insert([missionData]);
        error = insertError;
      }

      if (error) throw error;
      
      alert(selectedMission ? "✅ Missão atualizada!" : "🚀 Missão publicada!");
      
      // Limpa tudo e volta pra home
      if (setSelectedMission) setSelectedMission(null);
      setPage('home'); 
      
    } catch (error) {
      alert("Erro ao processar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (setSelectedMission) setSelectedMission(null);
    setPage('home');
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>{selectedMission ? "📝 Editar Missão" : "🚀 Nova Missão"}</h2>
        
        <form onSubmit={handlePublish}>
          <div className="input-group">
            <label>Fotos da Missão (Máx. 5)</label>
            <div 
              className="drag-drop-zone"
              onClick={() => document.getElementById('file-input').click()}
              style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', marginBottom: '10px' }}
            >
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📸 Clique para adicionar fotos</p>
              <input type="file" id="file-input" multiple accept="image/*" hidden onChange={(e) => handleFileChange(e.target.files)} />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {/* Preview de fotos que JÁ ESTÃO no Supabase */}
              {existingImages.map((url, index) => (
                <div key={`old-${index}`} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img src={url} alt="existente" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #0369a1' }} />
                  <button type="button" onClick={() => removeExistingImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}>×</button>
                </div>
              ))}

              {/* Preview de fotos NOVAS (blob local) */}
              {images.map((file, index) => (
                <div key={`new-${index}`} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img src={URL.createObjectURL(file)} alt="nova" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #10b981' }} />
                  <button type="button" onClick={() => removeNewImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Título</label>
            <input required type="text" maxLength={120} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Descrição</label>
            <textarea required rows="5" maxLength={750} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Cidade</label>
              <select className="city-dropdown" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
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
              <input required type="text" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Valor Esperado</label>
              <input type="number" value={formData.expected_value} onChange={e => setFormData({...formData, expected_value: e.target.value})} />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Data Limite</label>
              <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="button" className="btn-secondary-action" onClick={handleCancel} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn-cta" disabled={loading} style={{ flex: 2 }}>
              {loading ? "Processando..." : (selectedMission ? "Salvar Alterações" : "Publicar Missão")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
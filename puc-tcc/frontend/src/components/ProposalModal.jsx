import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const ProposalModal = ({ missionId, user, onClose }) => {
  const [text, setText] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('proposals')
        .insert([{
          mission_id: missionId,
          user_id: user.id,
          message: text,
          share_contact: shareContact
        }]);

      if (error) throw error;

      alert("Proposta enviada com sucesso!");
      onClose();
    } catch (error) {
      alert("Erro ao enviar proposta: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enviar Proposta</h3>
        <form onSubmit={handleSubmit}>
          <textarea 
            required
            placeholder="Descreva como pode ajudar e o seu preço..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
          />

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={shareContact}
              onChange={(e) => setShareContact(e.target.checked)}
              disabled={submitting}
            />
            Partilhar o meu e-mail e telefone de contacto
          </label>

          <div className="modal-buttons">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-main-action" disabled={submitting}>
              {submitting ? "A enviar..." : "Enviar Proposta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
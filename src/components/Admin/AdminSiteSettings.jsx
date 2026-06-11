import { useEffect, useState } from 'react';
import {
  emptySiteSettings,
  getSiteSettings,
  saveSiteSettings,
} from '../../services/siteSettingsService.js';

const settingsFields = [
  {
    id: 'brand_name',
    label: 'Nome da marca',
    placeholder: 'Ellen Paiva',
    type: 'text',
  },
  {
    id: 'owner_name',
    label: 'Nome da responsavel',
    placeholder: 'Ellen Paiva',
    type: 'text',
  },
  {
    id: 'instagram_url',
    label: 'Instagram',
    placeholder: 'https://instagram.com/...',
    type: 'url',
  },
  {
    id: 'whatsapp_url',
    label: 'WhatsApp',
    placeholder: 'https://wa.me/...',
    type: 'url',
  },
  {
    id: 'tendencia_url',
    label: 'Link da Tendencia',
    placeholder: 'https://...',
    type: 'url',
  },
  {
    id: 'contact_email',
    label: 'E-mail de contato',
    placeholder: 'contato@ellenpaiva.com.br',
    type: 'email',
  },
];

function AdminSiteSettings({ onSaved }) {
  const [settings, setSettings] = useState(emptySiteSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isMissingTable, setIsMissingTable] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      setIsLoading(true);
      setError('');

      const result = await getSiteSettings();

      if (!isMounted) {
        return;
      }

      setSettings(result.data);
      setIsMissingTable(result.isMissingTable);

      if (result.isMissingTable) {
        setError('Configuracoes ainda nao ativadas. Execute o SQL indicado no Supabase.');
      } else if (result.error) {
        setError(result.error);
      }

      setIsLoading(false);
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateSetting(field, value) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage('');
    setError(isMissingTable ? 'Configuracoes ainda nao ativadas. Execute o SQL indicado no Supabase.' : '');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isMissingTable) {
      setError('Configuracoes ainda nao ativadas. Execute o SQL indicado no Supabase.');
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const savedSettings = await saveSiteSettings(settings);
      setSettings(savedSettings);
      setMessage('Configuracoes salvas com sucesso.');
      await onSaved?.(savedSettings);
    } catch (saveError) {
      setError(saveError.message || 'Nao foi possivel salvar as configuracoes.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="admin-site-settings" aria-labelledby="admin-site-settings-title">
      <div className="admin-site-settings-header">
        <div>
          <p className="admin-kicker">Configuracoes</p>
          <h2 id="admin-site-settings-title">Configurações da Marca</h2>
        </div>
        <p>Base administrativa para dados simples da marca. A landing publica ainda nao consome esses campos.</p>
      </div>

      {isLoading ? (
        <p className="admin-empty">Carregando configuracoes...</p>
      ) : (
        <form className="admin-settings-form" onSubmit={handleSubmit}>
          <div className="admin-settings-grid">
            {settingsFields.map((field) => (
              <label key={field.id}>
                <span>{field.label}</span>
                <input
                  type={field.type}
                  value={settings[field.id] || ''}
                  onChange={(event) => updateSetting(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  disabled={isMissingTable}
                />
              </label>
            ))}
          </div>

          <label className="admin-settings-signature">
            <span>Texto curto de assinatura/curadoria</span>
            <textarea
              rows="4"
              value={settings.signature_text || ''}
              onChange={(event) => updateSetting('signature_text', event.target.value)}
              placeholder="Uma frase curta sobre curadoria, estilo ou posicionamento da marca."
              disabled={isMissingTable}
            />
          </label>

          {(message || error) && (
            <p className={`admin-message ${error ? 'admin-message-error' : 'admin-message-success'}`}>
              {error || message}
            </p>
          )}

          {isMissingTable && (
            <p className="admin-settings-note">
              Arquivo SQL: <code>docs/supabase-site-settings.sql</code>
            </p>
          )}

          <button className="admin-button admin-button-primary" type="submit" disabled={isSaving || isMissingTable}>
            {isSaving ? 'Salvando...' : 'Salvar configuracoes'}
          </button>
        </form>
      )}
    </section>
  );
}

export default AdminSiteSettings;

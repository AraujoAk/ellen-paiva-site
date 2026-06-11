import { useEffect, useState } from 'react';
import { getRecentActivityLogs } from '../../services/activityLogService.js';

const ACTION_LABELS = {
  post_created: 'criou o post',
  post_updated: 'editou o post',
  post_published: 'publicou o post',
  post_archived: 'arquivou o post',
  post_duplicated: 'duplicou o post',
  post_deleted: 'excluiu o post',
  editor_approved: 'aprovou o editor',
  editor_rejected: 'reprovou o editor',
  site_settings_updated: 'alterou configuracoes da marca',
};

function formatActivityDate(date) {
  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function getActorName(activity) {
  return activity.actor_name || activity.actor_email || 'Usuario editorial';
}

function getActionLabel(action) {
  return ACTION_LABELS[action] || action?.replaceAll('_', ' ') || 'registrou atividade';
}

function AdminActivityLog({ refreshToken = 0 }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMissingTable, setIsMissingTable] = useState(false);

  async function loadActivities() {
    setIsLoading(true);
    setError('');

    const result = await getRecentActivityLogs(20);
    setActivities(result.data);
    setIsMissingTable(result.isMissingTable);

    if (result.isMissingTable) {
      setError('Historico ainda nao ativado. Execute o SQL indicado no Supabase.');
    } else if (result.error) {
      setError(result.error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadActivities();
  }, [refreshToken]);

  return (
    <section className="admin-activity-log" aria-labelledby="admin-activity-log-title">
      <div className="admin-activity-log-header">
        <div>
          <p className="admin-kicker">Historico</p>
          <h2 id="admin-activity-log-title">Atividades editoriais</h2>
        </div>
        <button className="admin-button admin-button-secondary" type="button" onClick={loadActivities}>
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <p className="admin-empty">Carregando atividades...</p>
      ) : error ? (
        <div className="admin-activity-empty">
          <p className="admin-empty">{error}</p>
          {isMissingTable && <code>docs/supabase-activity-log.sql</code>}
        </div>
      ) : activities.length ? (
        <div className="admin-activity-list">
          {activities.map((activity) => (
            <article className="admin-activity-item" key={activity.id}>
              <div>
                <p>
                  <strong>{getActorName(activity)}</strong> {getActionLabel(activity.action)}
                  {activity.entity_title ? <span> "{activity.entity_title}"</span> : null}
                </p>
                <small>{formatActivityDate(activity.created_at)}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty">Nenhuma atividade registrada ainda.</p>
      )}
    </section>
  );
}

export default AdminActivityLog;

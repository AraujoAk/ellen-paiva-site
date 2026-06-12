const AGENDA_FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Publicados', value: 'active' },
  { label: 'Rascunhos', value: 'inactive' },
  { label: 'Planejados', value: 'planned' },
  { label: 'Arquivados', value: 'archived' },
];

const AGENDA_GROUPS = [
  { key: 'today', title: 'Hoje' },
  { key: 'week', title: 'Esta semana' },
  { key: 'upcoming', title: 'Proximos' },
  { key: 'undated', title: 'Sem data' },
];

const STATUS_LABELS = {
  active: 'Publicado',
  inactive: 'Rascunho',
  archived: 'Arquivado',
  planned: 'Planejado',
};

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function startOfWeek(date) {
  const day = startOfDay(date);
  const weekDay = day.getDay();
  const diff = weekDay === 0 ? -6 : 1 - weekDay;
  day.setDate(day.getDate() + diff);
  return day;
}

function endOfWeek(date) {
  const day = startOfWeek(date);
  day.setDate(day.getDate() + 6);
  day.setHours(23, 59, 59, 999);
  return day;
}

function getPostDate(post) {
  if (!post.published_at) {
    return null;
  }

  const date = new Date(post.published_at);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(firstDate, secondDate) {
  return startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime();
}

function isFutureDate(date) {
  return date.getTime() > Date.now();
}

function getAgendaStatus(post) {
  const date = getPostDate(post);

  if (post.status === 'inactive' && date && isFutureDate(date)) {
    return 'planned';
  }

  return post.status;
}

function getAgendaGroup(post) {
  const date = getPostDate(post);

  if (!date) {
    return 'undated';
  }

  const today = new Date();

  if (isSameDay(date, today)) {
    return 'today';
  }

  if (date >= startOfWeek(today) && date <= endOfWeek(today)) {
    return 'week';
  }

  return 'upcoming';
}

function formatAgendaDate(post) {
  const date = getPostDate(post);

  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getAgendaDateLabel(post, agendaStatus) {
  const formattedDate = formatAgendaDate(post);

  if (agendaStatus === 'planned' && formattedDate !== 'Sem data') {
    return `Planejado para ${formattedDate}`;
  }

  return formattedDate;
}

function getAgendaAutomationLabel(agendaStatus) {
  if (agendaStatus === 'planned') {
    return 'Publicacao automatica ativa';
  }

  if (agendaStatus === 'active') {
    return 'Publicado na Revista';
  }

  return '';
}

function sortAgendaPosts(posts) {
  return [...posts].sort((firstPost, secondPost) => {
    const firstDate = getPostDate(firstPost);
    const secondDate = getPostDate(secondPost);

    if (!firstDate && !secondDate) {
      return new Date(secondPost.created_at || 0) - new Date(firstPost.created_at || 0);
    }

    if (!firstDate) {
      return 1;
    }

    if (!secondDate) {
      return -1;
    }

    return firstDate - secondDate;
  });
}

function AdminEditorialAgenda({ posts, activeFilter, onFilterChange, onEdit, onNewPost }) {
  const visiblePosts = sortAgendaPosts(
    posts.filter((post) => {
      const agendaStatus = getAgendaStatus(post);
      return activeFilter === 'all' || agendaStatus === activeFilter;
    }),
  );

  const groupedPosts = AGENDA_GROUPS.reduce((groups, group) => {
    groups[group.key] = visiblePosts.filter((post) => getAgendaGroup(post) === group.key);
    return groups;
  }, {});

  return (
    <section className="admin-editorial-agenda" aria-labelledby="admin-editorial-agenda-title">
      <div className="admin-editorial-agenda-header">
        <div>
          <p className="admin-kicker">Agenda Editorial</p>
          <h2 id="admin-editorial-agenda-title">Conteudos por data</h2>
        </div>
        <div className="admin-agenda-header-actions">
          <small className="admin-agenda-automation" data-tour="automatic-publishing">
            Publicacao automatica ativa
          </small>
          <button className="admin-button admin-button-primary" type="button" onClick={onNewPost}>
            Novo conteudo
          </button>
        </div>
      </div>

      <div className="admin-agenda-filters" aria-label="Filtros da agenda editorial">
        {AGENDA_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={activeFilter === filter.value ? 'is-active' : ''}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="admin-agenda-groups">
        {AGENDA_GROUPS.map((group) => {
          const groupPosts = groupedPosts[group.key] || [];

          return (
            <article className="admin-agenda-group" key={group.key}>
              <div className="admin-agenda-group-heading">
                <h3>{group.title}</h3>
                <span>{groupPosts.length}</span>
              </div>

              {groupPosts.length > 0 ? (
                <div className="admin-agenda-items">
                  {groupPosts.map((post) => {
                    const agendaStatus = getAgendaStatus(post);

                    return (
                      <div className="admin-agenda-item" key={post.id}>
                        <div>
                          <span className={`admin-post-status admin-post-status-${agendaStatus}`}>
                            {STATUS_LABELS[agendaStatus] ?? agendaStatus}
                          </span>
                          <strong>{post.title || 'Sem titulo'}</strong>
                          <div className="admin-post-meta">
                            <small>{post.category || 'Sem categoria'}</small>
                            <small>{getAgendaDateLabel(post, agendaStatus)}</small>
                          </div>
                          {getAgendaAutomationLabel(agendaStatus) && (
                            <small className="admin-agenda-automation">
                              {getAgendaAutomationLabel(agendaStatus)}
                            </small>
                          )}
                        </div>

                        <button className="admin-button admin-button-secondary" type="button" onClick={() => onEdit(post)}>
                          Editar
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="admin-empty">Nenhum conteudo neste grupo.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdminEditorialAgenda;

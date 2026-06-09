const STATUS_LABELS = {
  active: 'Publicado',
  inactive: 'Rascunho',
  archived: 'Arquivado',
};

const STATUS_FILTERS = [
  { label: 'Todos', value: 'all', countKey: 'total' },
  { label: 'Publicados', value: 'active', countKey: 'active' },
  { label: 'Rascunhos', value: 'inactive', countKey: 'drafts' },
  { label: 'Arquivados', value: 'archived', countKey: 'archived' },
];

function formatDate(date) {
  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function AdminPostList({
  visiblePosts,
  stats,
  searchTerm,
  statusFilter,
  sortMode,
  selectedPostId,
  onSearchChange,
  onStatusFilterChange,
  onSortModeChange,
  onEdit,
  onNewPost,
  onArchive,
  onDuplicate,
  onDelete,
}) {
  return (
    <aside className="admin-post-list" aria-labelledby="admin-post-list-title">
      <div className="admin-post-list-header">
        <div>
          <p className="admin-kicker">Conteudos</p>
          <h2 id="admin-post-list-title">Posts da Revista</h2>
        </div>
        <button className="admin-button admin-button-primary" type="button" onClick={onNewPost} data-tour="new-content">
          Novo post
        </button>
      </div>

      <div className="admin-post-tools" aria-label="Ferramentas de busca e filtro">
        <label>
          Buscar
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Titulo, categoria ou descricao"
          />
        </label>

        <label>
          Ordenar
          <select value={sortMode} onChange={(event) => onSortModeChange(event.target.value)}>
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </label>
      </div>

      <div className="admin-status-filters" aria-label="Filtros por status">
        {STATUS_FILTERS.map((filter) => (
          <button
            className={statusFilter === filter.value ? 'is-active' : ''}
            type="button"
            key={filter.value}
            onClick={() => onStatusFilterChange(filter.value)}
          >
            {filter.label} ({stats[filter.countKey]})
          </button>
        ))}
      </div>

      <div className="admin-editorial-counter" aria-label="Resumo editorial da Revista">
        <span>Total: {stats.total}</span>
        <span>Publicados: {stats.active}</span>
        <span>Rascunhos: {stats.drafts}</span>
        <span>Arquivados: {stats.archived}</span>
        <span>Limite editorial: {stats.active}/10 ativos</span>
      </div>

      <div className="admin-post-items">
        {visiblePosts.length === 0 ? (
          <p className="admin-empty">Nenhum post encontrado.</p>
        ) : (
          visiblePosts.map((post) => (
            <article className={`admin-post-item ${post.id === selectedPostId ? 'is-selected' : ''}`} key={post.id}>
              <button type="button" onClick={() => onEdit(post)}>
                <span className={`admin-post-status admin-post-status-${post.status}`}>
                  {STATUS_LABELS[post.status] ?? post.status}
                </span>
                <strong>{post.title}</strong>
                <span className="admin-post-meta">
                  <small>{post.category}</small>
                  <small>{formatDate(post.published_at || post.created_at)}</small>
                </span>
              </button>

              <div className="admin-post-actions">
                <button type="button" onClick={() => onDuplicate(post)}>
                  Duplicar
                </button>
                {post.status !== 'archived' && (
                  <button type="button" onClick={() => onArchive(post.id)}>
                    Arquivar
                  </button>
                )}
                <button className="is-danger" type="button" onClick={() => onDelete(post.id)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}

export default AdminPostList;

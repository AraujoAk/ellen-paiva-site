import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminGuard from '../../components/Admin/AdminGuard.jsx';
import EditorialAssistant from '../../components/Admin/EditorialAssistant.jsx';
import AdminPostForm from '../../components/Admin/AdminPostForm.jsx';
import AdminPostList from '../../components/Admin/AdminPostList.jsx';
import { approveEditor, listPendingEditors, rejectEditor, signOut } from '../../services/authService.js';
import {
  archiveMagazinePost,
  createMagazinePost,
  deleteMagazinePost,
  duplicateMagazinePost,
  getAllMagazinePosts,
  updateMagazinePost,
  uploadMagazineImage,
} from '../../services/magazineAdminService.js';
import './AdminPage.css';

const newPost = {
  title: '',
  category: 'Estilo inteligente',
  description: '',
  image_url: '',
  image_path: '',
  status: 'inactive',
  published_at: '',
};

function formatLastPublication(date) {
  if (!date) {
    return 'Sem publicação';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getMagazineStats(posts) {
  const activePosts = posts.filter((post) => post.status === 'active');
  const latestPublishedPost = activePosts
    .filter((post) => post.published_at)
    .sort((firstPost, secondPost) => new Date(secondPost.published_at) - new Date(firstPost.published_at))[0];

  return {
    total: posts.length,
    active: activePosts.length,
    drafts: posts.filter((post) => post.status === 'inactive').length,
    archived: posts.filter((post) => post.status === 'archived').length,
    latestPublication: latestPublishedPost?.published_at || null,
  };
}

function filterPosts(posts, searchTerm, statusFilter) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [post.title, post.category, post.description].some((value) =>
      String(value || '')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  });
}

function sortPosts(posts, sortMode) {
  return [...posts].sort((firstPost, secondPost) => {
    if (sortMode === 'oldest') {
      return new Date(firstPost.created_at) - new Date(secondPost.created_at);
    }

    if (sortMode === 'az') {
      return firstPost.title.localeCompare(secondPost.title, 'pt-BR');
    }

    if (sortMode === 'za') {
      return secondPost.title.localeCompare(firstPost.title, 'pt-BR');
    }

    return new Date(secondPost.created_at) - new Date(firstPost.created_at);
  });
}

function AdminPanel({ profile }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(newPost);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const [pendingEditors, setPendingEditors] = useState([]);
  const [isLoadingEditors, setIsLoadingEditors] = useState(false);

  const editorName = useMemo(() => profile.name || profile.email || 'Editor', [profile]);
  const isAdminProfile = profile.role === 'admin';
  const stats = useMemo(() => getMagazineStats(posts), [posts]);
  const filteredPosts = useMemo(
    () => sortPosts(filterPosts(posts, searchTerm, statusFilter), sortMode),
    [posts, searchTerm, statusFilter, sortMode],
  );

  async function loadPosts() {
    setIsLoadingPosts(true);
    setError('');

    try {
      const data = await getAllMagazinePosts();
      setPosts(data);
    } catch (loadError) {
      setError(loadError.message || 'Nao foi possivel carregar os posts.');
    } finally {
      setIsLoadingPosts(false);
    }
  }

  const loadEditorRequests = useCallback(async () => {
    if (!isAdminProfile) {
      return;
    }

    setIsLoadingEditors(true);

    try {
      const data = await listPendingEditors();
      setPendingEditors(data);
    } catch (loadError) {
      setError(loadError.message || 'Nao foi possivel carregar as solicitacoes editoriais.');
    } finally {
      setIsLoadingEditors(false);
    }
  }, [isAdminProfile]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadEditorRequests();
  }, [loadEditorRequests]);

  async function handleSave(postPayload) {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      if (selectedPost.id) {
        await updateMagazinePost(selectedPost.id, postPayload);
      } else {
        await createMagazinePost(postPayload);
      }

      await loadPosts();
      setSelectedPost(newPost);
      setMessage(postPayload.status === 'active' ? 'Conteudo publicado com sucesso.' : 'Conteudo salvo com sucesso.');
    } catch (saveError) {
      setError(saveError.message || 'Nao foi possivel salvar o post.');
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive(postId) {
    setMessage('');
    setError('');

    try {
      const archivedPost = await archiveMagazinePost(postId);

      if (selectedPost.id === postId) {
        setSelectedPost(archivedPost);
      }

      await loadPosts();
      setMessage('Conteudo arquivado com sucesso.');
    } catch (archiveError) {
      setError(archiveError.message || 'Nao foi possivel arquivar o post.');
    }
  }

  async function handleDuplicate(post) {
    setMessage('');
    setError('');

    try {
      await duplicateMagazinePost(post);
      await loadPosts();
      setStatusFilter('inactive');
      setMessage('Conteudo duplicado como rascunho.');
    } catch (duplicateError) {
      setError(duplicateError.message || 'Nao foi possivel duplicar o post.');
    }
  }

  async function handleDelete(postId) {
    const shouldDelete = window.confirm('Tem certeza que deseja excluir este conteudo?');

    if (!shouldDelete) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await deleteMagazinePost(postId);

      if (selectedPost.id === postId) {
        setSelectedPost(newPost);
      }

      await loadPosts();
      setMessage('Conteudo excluido com sucesso.');
    } catch (deleteError) {
      setError(deleteError.message || 'Nao foi possivel excluir o post.');
    }
  }

  async function handleSignOut() {
    await signOut();
    window.location.reload();
  }

  async function handleApproveEditor(profileId) {
    setMessage('');
    setError('');

    try {
      await approveEditor(profileId);
      setPendingEditors((current) => current.filter((editor) => editor.id !== profileId));
      setMessage('Editor aprovado com sucesso.');
    } catch (approvalError) {
      setError(approvalError.message || 'Nao foi possivel aprovar este editor.');
    }
  }

  async function handleRejectEditor(profileId) {
    setMessage('');
    setError('');

    try {
      await rejectEditor(profileId);
      setPendingEditors((current) => current.filter((editor) => editor.id !== profileId));
      setMessage('Solicitacao mantida sem acesso editorial.');
    } catch (rejectionError) {
      setError(rejectionError.message || 'Nao foi possivel reprovar este editor.');
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/" aria-label="Voltar para Ellen Paiva">
          Ellen Paiva
        </a>
        <div className="admin-header-actions">
          <span>{editorName}</span>
          <button className="admin-button admin-button-secondary" type="button" onClick={handleSignOut}>
            Sair
          </button>
        </div>
      </header>

      <section className="admin-hero" aria-labelledby="admin-title">
        <div className="admin-hero-copy">
          <p className="admin-kicker">Painel editorial</p>
          <h1 id="admin-title">Revista Ellen Paiva</h1>
          <p>Gerencie os posts exibidos na secao Revista sem alterar layout, cores ou estrutura da landing.</p>
        </div>

        <div className="admin-dashboard" aria-label="Dashboard editorial da Revista" data-tour="dashboard">
          <button type="button" onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'is-active' : ''}>
            <span>Total de conteudos</span>
            <strong>{stats.total}</strong>
          </button>
          <button type="button" onClick={() => setStatusFilter('active')} className={statusFilter === 'active' ? 'is-active' : ''}>
            <span>Publicados</span>
            <strong>{stats.active}</strong>
          </button>
          <button type="button" onClick={() => setStatusFilter('inactive')} className={statusFilter === 'inactive' ? 'is-active' : ''}>
            <span>Rascunhos</span>
            <strong>{stats.drafts}</strong>
          </button>
          <button type="button" onClick={() => setStatusFilter('archived')} className={statusFilter === 'archived' ? 'is-active' : ''}>
            <span>Arquivados</span>
            <strong>{stats.archived}</strong>
          </button>
          <button type="button" className="admin-dashboard-latest" onClick={() => setSortMode('newest')}>
            <span>Ultima publicacao</span>
            <strong className="admin-dashboard-date">{formatLastPublication(stats.latestPublication)}</strong>
          </button>
        </div>
      </section>

      {(message || error) && (
        <div className={`admin-message ${error ? 'admin-message-error' : 'admin-message-success'}`} role="status">
          {error || message}
        </div>
      )}

      {isAdminProfile && (
        <section className="admin-editor-requests" aria-labelledby="admin-editor-requests-title">
          <div className="admin-editor-requests-header">
            <div>
              <p className="admin-kicker">Acessos</p>
              <h2 id="admin-editor-requests-title">Solicitações editoriais</h2>
            </div>
            <button className="admin-button admin-button-secondary" type="button" onClick={loadEditorRequests}>
              Atualizar
            </button>
          </div>

          {isLoadingEditors ? (
            <p className="admin-empty">Carregando solicitações...</p>
          ) : pendingEditors.length ? (
            <div className="admin-editor-request-list">
              {pendingEditors.map((editor) => (
                <article className="admin-editor-request" key={editor.id}>
                  <div>
                    <strong>{editor.name || 'Sem nome informado'}</strong>
                    <span>{editor.email}</span>
                    <small>{editor.created_at ? new Intl.DateTimeFormat('pt-BR').format(new Date(editor.created_at)) : 'Sem data'}</small>
                  </div>
                  <div className="admin-editor-request-actions">
                    <button className="admin-button admin-button-primary" type="button" onClick={() => handleApproveEditor(editor.id)}>
                      Aprovar
                    </button>
                    <button className="admin-button admin-button-secondary" type="button" onClick={() => handleRejectEditor(editor.id)}>
                      Reprovar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="admin-empty">Nenhuma solicitação editorial pendente.</p>
          )}
        </section>
      )}

      <section className="admin-newsletter-insight" data-tour="newsletter" aria-labelledby="admin-newsletter-title">
        <div>
          <p className="admin-kicker">Audiência</p>
          <h2 id="admin-newsletter-title">Newsletter</h2>
        </div>
        <p>Os inscritos da Newsletter formam uma base própria para relacionamento editorial e futuras campanhas.</p>
      </section>

      <div className="admin-workspace">
        {isLoadingPosts ? (
          <p className="admin-loading">Carregando posts...</p>
        ) : (
          <AdminPostList
            posts={posts}
            visiblePosts={filteredPosts}
            stats={stats}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            sortMode={sortMode}
            selectedPostId={selectedPost.id}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onSortModeChange={setSortMode}
            onEdit={setSelectedPost}
            onNewPost={() => setSelectedPost(newPost)}
            onArchive={handleArchive}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}

        <AdminPostForm
          post={selectedPost}
          isSaving={isSaving}
          onSave={handleSave}
          onUploadImage={uploadMagazineImage}
          onResetComplete={() => setSelectedPost(newPost)}
        />
      </div>
      <EditorialAssistant />
    </main>
  );
}

function AdminPage() {
  return <AdminGuard>{({ profile }) => <AdminPanel profile={profile} />}</AdminGuard>;
}

export default AdminPage;

import { useEffect, useMemo, useState } from 'react';
import AdminGuard from '../../components/Admin/AdminGuard.jsx';
import AdminPostForm from '../../components/Admin/AdminPostForm.jsx';
import AdminPostList from '../../components/Admin/AdminPostList.jsx';
import { signOut } from '../../services/authService.js';
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
    return 'Sem publicacao';
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

  const editorName = useMemo(() => profile.name || profile.email || 'Editor', [profile]);
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

  useEffect(() => {
    loadPosts();
  }, []);

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

        <div className="admin-dashboard" aria-label="Dashboard editorial da Revista">
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
          <button type="button" onClick={() => setSortMode('newest')}>
            <span>Ultima publicacao</span>
            <strong>{formatLastPublication(stats.latestPublication)}</strong>
          </button>
        </div>
      </section>

      {(message || error) && (
        <div className={`admin-message ${error ? 'admin-message-error' : 'admin-message-success'}`} role="status">
          {error || message}
        </div>
      )}

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
    </main>
  );
}

function AdminPage() {
  return <AdminGuard>{({ profile }) => <AdminPanel profile={profile} />}</AdminGuard>;
}

export default AdminPage;

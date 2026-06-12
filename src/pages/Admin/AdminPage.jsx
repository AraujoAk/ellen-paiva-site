import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminGuard from '../../components/Admin/AdminGuard.jsx';
import AdminActivityLog from '../../components/Admin/AdminActivityLog.jsx';
import AdminEditorialAgenda from '../../components/Admin/AdminEditorialAgenda.jsx';
import EditorialAssistant from '../../components/Admin/EditorialAssistant.jsx';
import AdminHelpCenter from '../../components/Admin/AdminHelpCenter.jsx';
import AdminPostForm from '../../components/Admin/AdminPostForm.jsx';
import AdminPostList from '../../components/Admin/AdminPostList.jsx';
import AdminSiteSettings from '../../components/Admin/AdminSiteSettings.jsx';
import { approveEditor, listPendingEditors, rejectEditor, signOut } from '../../services/authService.js';
import {
  getEditorialExecutiveDates,
  getNewsletterExecutiveStats,
} from '../../services/adminDashboardService.js';
import {
  archiveMagazinePost,
  createMagazinePost,
  deleteMagazinePost,
  duplicateMagazinePost,
  getAllMagazinePosts,
  listMagazineImages,
  updateMagazinePost,
  uploadMagazineImage,
} from '../../services/magazineAdminService.js';
import { logActivity } from '../../services/activityLogService.js';
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

function formatDateTime(date) {
  if (!date) {
    return 'Sem registro';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatMetric(value) {
  return typeof value === 'number' ? value : '--';
}

const ACTIVITY_LABELS = {
  post_created: 'Criou post',
  post_updated: 'Editou post',
  post_published: 'Publicou post',
  post_archived: 'Arquivou post',
  post_duplicated: 'Duplicou post',
  post_deleted: 'Excluiu post',
  editor_approved: 'Aprovou editor',
  editor_rejected: 'Reprovou editor',
  site_settings_updated: 'Alterou configuracoes',
};

function getActivityLabel(action) {
  return ACTIVITY_LABELS[action] || action?.replaceAll('_', ' ') || 'Sem atividade';
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
    latestCreated:
      [...posts].sort((firstPost, secondPost) => new Date(secondPost.created_at) - new Date(firstPost.created_at))[0]
        ?.created_at || null,
    latestUpdated:
      [...posts].sort((firstPost, secondPost) => new Date(secondPost.updated_at) - new Date(firstPost.updated_at))[0]
        ?.updated_at || null,
  };
}

function getExecutiveAlerts(posts, stats, settings, settingsError) {
  const activePosts = posts.filter((post) => post.status === 'active');
  const draftPosts = posts.filter((post) => post.status === 'inactive');
  const alerts = [];

  if (posts.some((post) => post.status !== 'archived' && !post.image_url)) {
    alerts.push('Ha conteudos sem imagem.');
  }

  if (draftPosts.some((post) => !post.published_at)) {
    alerts.push('Ha rascunhos sem data.');
  }

  if (stats.active === 0) {
    alerts.push('Revista sem posts ativos.');
  }

  if (settingsError) {
    alerts.push('Configuracoes da marca indisponiveis.');
  } else if (!settings) {
    alerts.push('Configuracoes da marca ainda nao ativadas.');
  } else {
    const requiredSettings = ['brand_name', 'owner_name', 'instagram_url', 'whatsapp_url', 'tendencia_url'];
    const hasMissingSettings = requiredSettings.some((field) => !settings[field]);

    if (hasMissingSettings) {
      alerts.push('Configuracoes da marca incompletas.');
    }
  }

  if (activePosts.length === 0 && posts.length > 0) {
    alerts.push('Todos os conteudos estao fora da Revista publica.');
  }

  return alerts.slice(0, 4);
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
  const [agendaFilter, setAgendaFilter] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const [pendingEditors, setPendingEditors] = useState([]);
  const [isLoadingEditors, setIsLoadingEditors] = useState(false);
  const [activeAdminSection, setActiveAdminSection] = useState('');
  const [activityRefreshToken, setActivityRefreshToken] = useState(0);
  const [newsletterStats, setNewsletterStats] = useState({
    total: null,
    last30Days: null,
    latestSubscribers: [],
    error: null,
  });
  const [editorialDates, setEditorialDates] = useState({
    latestPublication: null,
    latestCreated: null,
    latestUpdated: null,
    nextPlanned: null,
    latestActivity: null,
    latestActivityError: null,
    siteSettings: null,
    siteSettingsError: null,
    error: null,
  });
  const [isLoadingExecutiveStats, setIsLoadingExecutiveStats] = useState(true);
  const contentSectionRef = useRef(null);
  const agendaSectionRef = useRef(null);
  const newsletterSectionRef = useRef(null);
  const editorsSectionRef = useRef(null);
  const settingsSectionRef = useRef(null);
  const activitiesSectionRef = useRef(null);
  const isProgrammaticNavigationRef = useRef(false);
  const navigationUnlockTimeoutRef = useRef(null);

  const editorName = useMemo(() => profile.name || profile.email || 'Editor', [profile]);
  const isAdminProfile = profile.role === 'admin';
  const stats = useMemo(() => getMagazineStats(posts), [posts]);
  const filteredPosts = useMemo(
    () => sortPosts(filterPosts(posts, searchTerm, statusFilter), sortMode),
    [posts, searchTerm, statusFilter, sortMode],
  );
  const executiveAlerts = useMemo(
    () => getExecutiveAlerts(posts, stats, editorialDates.siteSettings, editorialDates.siteSettingsError),
    [posts, stats, editorialDates.siteSettings, editorialDates.siteSettingsError],
  );

  const scrollToAdminSection = useCallback((section) => {
    const sectionRefs = {
      content: contentSectionRef,
      agenda: agendaSectionRef,
      newsletter: newsletterSectionRef,
      editors: editorsSectionRef,
      settings: settingsSectionRef,
      activities: activitiesSectionRef,
    };

    isProgrammaticNavigationRef.current = true;
    setActiveAdminSection(section);
    sectionRefs[section]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.clearTimeout(navigationUnlockTimeoutRef.current);
    navigationUnlockTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticNavigationRef.current = false;
    }, 800);
  }, []);

  const handleAdminSectionNavigation = useCallback((section) => {
    scrollToAdminSection(section);
  }, [scrollToAdminSection]);

  const registerActivity = useCallback(async (payload) => {
    const wasLogged = await logActivity({
      ...payload,
      actor: profile,
    });

    if (wasLogged) {
      setActivityRefreshToken((current) => current + 1);
    }
  }, [profile]);

  const handleNewPost = useCallback(() => {
    setSelectedPost(newPost);
    window.setTimeout(() => {
      scrollToAdminSection('content');
    }, 0);
  }, [scrollToAdminSection]);

  const handleEditPost = useCallback((post) => {
    setSelectedPost(post);
    window.setTimeout(() => {
      scrollToAdminSection('content');
    }, 0);
  }, [scrollToAdminSection]);

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

  const loadExecutiveStats = useCallback(async () => {
    setIsLoadingExecutiveStats(true);

    const [newsletterResult, editorialResult] = await Promise.all([
      getNewsletterExecutiveStats(),
      getEditorialExecutiveDates(),
    ]);

    setNewsletterStats(newsletterResult);
    setEditorialDates(editorialResult);
    setIsLoadingExecutiveStats(false);
  }, []);

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

  useEffect(() => {
    loadExecutiveStats();
  }, [loadExecutiveStats]);

  useEffect(() => {
    let animationFrameId = 0;

    function updateActiveSectionFromScroll() {
      if (isProgrammaticNavigationRef.current) {
        return;
      }

      const focusLine = window.innerHeight * 0.4;
      const sectionEntries = [
        ['agenda', agendaSectionRef.current],
        ['settings', settingsSectionRef.current],
        ['editors', editorsSectionRef.current],
        ['newsletter', newsletterSectionRef.current],
        ['activities', activitiesSectionRef.current],
        ['content', contentSectionRef.current],
      ].filter(([, element]) => Boolean(element));

      const currentSection = sectionEntries
        .map(([section, element]) => {
          const rect = element.getBoundingClientRect();
          const isVisibleAtFocusLine = rect.top <= focusLine && rect.bottom >= focusLine;

          return {
            section,
            isVisibleAtFocusLine,
            distance: Math.abs(rect.top - focusLine),
          };
        })
        .filter((entry) => entry.isVisibleAtFocusLine)
        .sort((firstEntry, secondEntry) => firstEntry.distance - secondEntry.distance)[0];

      setActiveAdminSection(currentSection?.section || '');
    }

    function handleScroll() {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateActiveSectionFromScroll);
    }

    updateActiveSectionFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.clearTimeout(navigationUnlockTimeoutRef.current);
    };
  }, []);

  async function handleSave(postPayload) {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const existingPost = selectedPost.id ? selectedPost : null;
      let savedPost;

      if (selectedPost.id) {
        savedPost = await updateMagazinePost(selectedPost.id, postPayload);
      } else {
        savedPost = await createMagazinePost(postPayload);
      }

      await loadPosts();
      await loadExecutiveStats();
      setSelectedPost(newPost);
      setMessage(postPayload.status === 'active' ? 'Conteudo publicado com sucesso.' : 'Conteudo salvo com sucesso.');
      await registerActivity({
        action:
          postPayload.status === 'active' && existingPost?.status !== 'active'
            ? 'post_published'
            : existingPost
              ? 'post_updated'
              : 'post_created',
        entityType: 'magazine_post',
        entityId: savedPost.id,
        entityTitle: savedPost.title,
        metadata: {
          status: savedPost.status,
          category: savedPost.category,
        },
      });
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
      await loadExecutiveStats();
      setMessage('Conteudo arquivado com sucesso.');
      await registerActivity({
        action: 'post_archived',
        entityType: 'magazine_post',
        entityId: archivedPost.id,
        entityTitle: archivedPost.title,
        metadata: {
          category: archivedPost.category,
        },
      });
    } catch (archiveError) {
      setError(archiveError.message || 'Nao foi possivel arquivar o post.');
    }
  }

  async function handleDuplicate(post) {
    setMessage('');
    setError('');

    try {
      const duplicatedPost = await duplicateMagazinePost(post);
      await loadPosts();
      await loadExecutiveStats();
      setStatusFilter('inactive');
      setMessage('Conteudo duplicado como rascunho.');
      await registerActivity({
        action: 'post_duplicated',
        entityType: 'magazine_post',
        entityId: duplicatedPost.id,
        entityTitle: duplicatedPost.title,
        metadata: {
          source_id: post.id,
          source_title: post.title,
        },
      });
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
      const postToDelete = posts.find((post) => post.id === postId);
      await deleteMagazinePost(postId);

      if (selectedPost.id === postId) {
        setSelectedPost(newPost);
      }

      await loadPosts();
      await loadExecutiveStats();
      setMessage('Conteudo excluido com sucesso.');
      await registerActivity({
        action: 'post_deleted',
        entityType: 'magazine_post',
        entityId: postId,
        entityTitle: postToDelete?.title || 'Post excluido',
        metadata: {
          category: postToDelete?.category || null,
        },
      });
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
      const approvedEditor = await approveEditor(profileId);
      setPendingEditors((current) => current.filter((editor) => editor.id !== profileId));
      setMessage('Editor aprovado com sucesso.');
      await registerActivity({
        action: 'editor_approved',
        entityType: 'profile',
        entityId: approvedEditor.id,
        entityTitle: approvedEditor.name || approvedEditor.email,
        metadata: {
          email: approvedEditor.email,
        },
      });
    } catch (approvalError) {
      setError(approvalError.message || 'Nao foi possivel aprovar este editor.');
    }
  }

  async function handleRejectEditor(profileId) {
    setMessage('');
    setError('');

    try {
      const rejectedEditor = await rejectEditor(profileId);
      setPendingEditors((current) => current.filter((editor) => editor.id !== profileId));
      setMessage('Solicitacao mantida sem acesso editorial.');
      await registerActivity({
        action: 'editor_rejected',
        entityType: 'profile',
        entityId: rejectedEditor.id,
        entityTitle: rejectedEditor.name || rejectedEditor.email,
        metadata: {
          email: rejectedEditor.email,
        },
      });
    } catch (rejectionError) {
      setError(rejectionError.message || 'Nao foi possivel reprovar este editor.');
    }
  }

  async function handleSiteSettingsSaved(savedSettings) {
    await registerActivity({
      action: 'site_settings_updated',
      entityType: 'site_settings',
      entityId: '1',
      entityTitle: savedSettings.brand_name || 'Configuracoes da Marca',
    });
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

      <section className="admin-hero admin-hero-executive" aria-labelledby="admin-title">
        <div className="admin-hero-copy">
          <p className="admin-kicker">Painel editorial</p>
          <h1 id="admin-title">Revista Ellen Paiva</h1>
          <p>Gerencie os posts exibidos na secao Revista sem alterar layout, cores ou estrutura da landing.</p>
        </div>

        <div className="admin-executive-dashboard" aria-label="Dashboard executivo editorial" data-tour="dashboard">
          <section className="admin-executive-panel admin-executive-panel-featured" aria-labelledby="admin-next-planned-title">
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Proximo</p>
              <h2 id="admin-next-planned-title">Conteudo planejado</h2>
            </div>

            {editorialDates.nextPlanned ? (
              <div className="admin-executive-highlight">
                <strong>{editorialDates.nextPlanned.title}</strong>
                <span>{formatDateTime(editorialDates.nextPlanned.published_at)}</span>
                <small>{editorialDates.nextPlanned.status === 'inactive' ? 'Planejado' : editorialDates.nextPlanned.status}</small>
              </div>
            ) : (
              <p className="admin-executive-note">Nenhum conteudo planejado com data futura.</p>
            )}
          </section>

          <section className="admin-executive-panel" aria-labelledby="admin-latest-published-title">
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Publicado</p>
              <h2 id="admin-latest-published-title">Ultimo editorial</h2>
            </div>

            {editorialDates.latestPublication ? (
              <div className="admin-executive-highlight">
                <strong>{editorialDates.latestPublication.title}</strong>
                <span>{formatDateTime(editorialDates.latestPublication.published_at)}</span>
              </div>
            ) : (
              <p className="admin-executive-note">Sem publicacao registrada.</p>
            )}
          </section>

          <section
            className="admin-executive-panel admin-executive-panel-newsletter"
            data-tour="newsletter"
            aria-labelledby="admin-newsletter-metrics-title"
          >
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Newsletter</p>
              <h2 id="admin-newsletter-metrics-title">Audiencia propria</h2>
            </div>

            <div className="admin-executive-metrics">
              <article>
                <span>Total inscritos</span>
                <strong>{isLoadingExecutiveStats ? '...' : formatMetric(newsletterStats.total)}</strong>
              </article>
              <article>
                <span>Novos 30 dias</span>
                <strong>{isLoadingExecutiveStats ? '...' : formatMetric(newsletterStats.last30Days)}</strong>
              </article>
            </div>

            <div className="admin-latest-subscribers" aria-label="Ultimos inscritos da Newsletter">
              <p>Ultimo inscrito</p>
              {newsletterStats.latestSubscribers.length > 0 ? (
                <div className="admin-executive-highlight admin-executive-highlight-compact">
                  <strong>{newsletterStats.latestSubscribers[0].name || newsletterStats.latestSubscribers[0].email}</strong>
                  <span>{formatLastPublication(newsletterStats.latestSubscribers[0].created_at)}</span>
                </div>
              ) : (
                <small>
                  {newsletterStats.error ? 'Leitura indisponivel para este perfil.' : 'Nenhum inscrito recente.'}
                </small>
              )}
            </div>
          </section>

          <section className="admin-executive-panel" aria-labelledby="admin-content-metrics-title">
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Conteudo</p>
              <h2 id="admin-content-metrics-title">Revista</h2>
            </div>

            <div className="admin-dashboard" aria-label="Metricas de conteudo da Revista">
              <button type="button" onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? 'is-active' : ''}>
                <span>Total</span>
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
            </div>
          </section>

          <section className="admin-executive-panel" aria-labelledby="admin-editorial-metrics-title">
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Atividade</p>
              <h2 id="admin-editorial-metrics-title">Ultimo movimento</h2>
            </div>

            {editorialDates.latestActivity ? (
              <div className="admin-executive-highlight">
                <strong>{getActivityLabel(editorialDates.latestActivity.action)}</strong>
                <span>{editorialDates.latestActivity.actor_name || editorialDates.latestActivity.actor_email || 'Usuario editorial'}</span>
                <small>{formatDateTime(editorialDates.latestActivity.created_at)}</small>
              </div>
            ) : (
              <p className="admin-executive-note">
                {editorialDates.latestActivityError ? 'Historico indisponivel para este perfil.' : 'Nenhuma atividade registrada.'}
              </p>
            )}
          </section>

          <section className="admin-executive-panel admin-executive-panel-alerts" aria-labelledby="admin-alerts-title">
            <div className="admin-executive-panel-header">
              <p className="admin-kicker">Alertas</p>
              <h2 id="admin-alerts-title">Pontos de atencao</h2>
            </div>

            {executiveAlerts.length > 0 ? (
              <ul className="admin-executive-alerts">
                {executiveAlerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            ) : (
              <p className="admin-executive-note">Nenhum alerta editorial no momento.</p>
            )}
          </section>
        </div>
      </section>

      <nav className="admin-section-nav" aria-label="Navegacao interna do painel administrativo">
        <button
          type="button"
          className={activeAdminSection === 'content' ? 'is-active' : ''}
          onClick={() => handleAdminSectionNavigation('content')}
        >
          <strong>Conteudo</strong>
          <span>Posts da Revista</span>
        </button>
        <button
          type="button"
          className={activeAdminSection === 'agenda' ? 'is-active' : ''}
          onClick={() => handleAdminSectionNavigation('agenda')}
        >
          <strong>Agenda</strong>
          <span>Datas editoriais</span>
        </button>
        <button
          type="button"
          className={activeAdminSection === 'newsletter' ? 'is-active' : ''}
          onClick={() => handleAdminSectionNavigation('newsletter')}
        >
          <strong>Newsletter</strong>
          <span>Audiencia propria</span>
        </button>
        <button
          type="button"
          className={activeAdminSection === 'activities' ? 'is-active' : ''}
          onClick={() => handleAdminSectionNavigation('activities')}
        >
          <strong>Atividades</strong>
          <span>Historico</span>
        </button>
        {isAdminProfile && (
          <button
            type="button"
            className={activeAdminSection === 'editors' ? 'is-active' : ''}
            onClick={() => handleAdminSectionNavigation('editors')}
          >
            <strong>Editores</strong>
            <span>Aprovacoes</span>
          </button>
        )}
        {isAdminProfile && (
          <button
            type="button"
            className={activeAdminSection === 'settings' ? 'is-active' : ''}
            onClick={() => handleAdminSectionNavigation('settings')}
          >
            <strong>Configuracoes</strong>
            <span>Marca e contatos</span>
          </button>
        )}
      </nav>

      <div ref={agendaSectionRef} className="admin-section-anchor" data-tour="agenda">
        <AdminEditorialAgenda
          posts={posts}
          activeFilter={agendaFilter}
          onFilterChange={setAgendaFilter}
          onEdit={handleEditPost}
          onNewPost={handleNewPost}
        />
      </div>

      {isAdminProfile && (
        <div ref={settingsSectionRef} className="admin-section-anchor" data-tour="settings">
          <AdminSiteSettings onSaved={handleSiteSettingsSaved} />
        </div>
      )}

      {(message || error) && (
        <div className={`admin-message ${error ? 'admin-message-error' : 'admin-message-success'}`} role="status">
          {error || message}
        </div>
      )}

      {isAdminProfile && (
        <section
          ref={editorsSectionRef}
          className="admin-editor-requests"
          data-tour="editors"
          aria-labelledby="admin-editor-requests-title"
        >
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

      <section
        ref={newsletterSectionRef}
        className="admin-newsletter-insight"
        data-tour="newsletter"
        aria-labelledby="admin-newsletter-title"
      >
        <div>
          <p className="admin-kicker">Audiência</p>
          <h2 id="admin-newsletter-title">Newsletter</h2>
        </div>
        <p>Os inscritos da Newsletter formam uma base própria para relacionamento editorial e futuras campanhas.</p>
      </section>

      <div ref={activitiesSectionRef} className="admin-section-anchor" data-tour="activities">
        <AdminActivityLog refreshToken={activityRefreshToken} />
      </div>

      <div ref={contentSectionRef} className="admin-workspace" data-tour="content-area">
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
            onEdit={handleEditPost}
            onNewPost={handleNewPost}
            onArchive={handleArchive}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}

        <div data-tour="editorial-form">
          <AdminPostForm
          post={selectedPost}
          isSaving={isSaving}
          onSave={handleSave}
          onUploadImage={uploadMagazineImage}
          onListImages={listMagazineImages}
          onResetComplete={() => setSelectedPost(newPost)}
          />
        </div>
      </div>
      <AdminHelpCenter />
      <EditorialAssistant isAdmin={isAdminProfile} />
    </main>
  );
}

function AdminPage() {
  return <AdminGuard>{({ profile }) => <AdminPanel profile={profile} />}</AdminGuard>;
}

export default AdminPage;

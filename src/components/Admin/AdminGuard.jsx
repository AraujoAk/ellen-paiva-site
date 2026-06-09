import { useCallback, useEffect, useState } from 'react';
import { getCurrentProfile, getSession, signOut } from '../../services/authService.js';
import AdminLogin from './AdminLogin.jsx';

const ADMIN_SESSION_ACTIVITY_KEY = 'ellen_admin_last_activity_at';
const ADMIN_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function getStoredActivityTime() {
  const storedValue = window.localStorage.getItem(ADMIN_SESSION_ACTIVITY_KEY);
  const timestamp = Number(storedValue);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function markAdminActivity() {
  window.localStorage.setItem(ADMIN_SESSION_ACTIVITY_KEY, String(Date.now()));
}

function clearAdminActivity() {
  window.localStorage.removeItem(ADMIN_SESSION_ACTIVITY_KEY);
}

function AdminGuard({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    session: null,
    profile: null,
    error: '',
    notice: '',
  });

  const expireAdminSession = useCallback(async (message = 'Sua sessão expirou. Faça login novamente.') => {
    await signOut();
    clearAdminActivity();
    setAuthState({
      isLoading: false,
      session: null,
      profile: null,
      error: '',
      notice: message,
    });
  }, []);

  const refreshAuthState = useCallback(async (notice = '') => {
    setAuthState((current) => ({
      ...current,
      isLoading: true,
      error: '',
      notice,
    }));

    try {
      const session = await getSession();

      if (!session) {
        setAuthState({
          isLoading: false,
          session: null,
          profile: null,
          error: '',
          notice,
        });
        return;
      }

      const profile = await getCurrentProfile();

      if (profile?.can_edit_magazine) {
        const lastActivityTime = getStoredActivityTime();
        const isExpired = lastActivityTime && Date.now() - lastActivityTime > ADMIN_SESSION_TIMEOUT_MS;

        if (isExpired) {
          await expireAdminSession();
          return;
        }

        markAdminActivity();
      }

      setAuthState({
        isLoading: false,
        session,
        profile,
        error: '',
        notice,
      });
    } catch {
      setAuthState({
        isLoading: false,
        session: null,
        profile: null,
        error: 'Nao foi possivel validar o acesso.',
        notice: '',
      });
    }
  }, [expireAdminSession]);

  async function handleDeniedSignOut() {
    await signOut();
    clearAdminActivity();
    setAuthState({
      isLoading: false,
      session: null,
      profile: null,
      error: '',
      notice: '',
    });
  }

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  useEffect(() => {
    if (!authState.session || !authState.profile?.can_edit_magazine) {
      return undefined;
    }

    function handleActivity() {
      markAdminActivity();
    }

    async function checkSessionExpiration() {
      const lastActivityTime = getStoredActivityTime();

      if (lastActivityTime && Date.now() - lastActivityTime > ADMIN_SESSION_TIMEOUT_MS) {
        await expireAdminSession();
      }
    }

    const activityEvents = ['click', 'keydown', 'scroll', 'mousemove'];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, handleActivity, { passive: true }));
    const intervalId = window.setInterval(checkSessionExpiration, 30 * 1000);

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
      window.clearInterval(intervalId);
    };
  }, [authState.session, authState.profile, expireAdminSession]);

  if (authState.isLoading) {
    return (
      <div className="admin-shell">
        <p className="admin-loading">Carregando acesso...</p>
      </div>
    );
  }

  if (!authState.session) {
    return <AdminLogin initialError={authState.notice} onAuthenticated={refreshAuthState} />;
  }

  if (!authState.profile?.can_edit_magazine) {
    return (
      <main className="admin-shell">
        <section className="admin-denied">
          <p className="admin-kicker">Acesso restrito</p>
          <h1>Acesso negado</h1>
          <p>Este usuario nao tem permissao para editar a Revista Ellen Paiva.</p>
          <div className="admin-denied-actions">
            <button className="admin-button admin-button-primary" type="button" onClick={handleDeniedSignOut}>
              Sair e voltar ao login
            </button>
            <a className="admin-button admin-button-secondary" href="/">
              Voltar para o site
            </a>
          </div>
        </section>
      </main>
    );
  }

  return children({ profile: authState.profile, refreshAuthState });
}

export default AdminGuard;

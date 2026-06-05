import { useEffect, useState } from 'react';
import { getCurrentProfile, getSession } from '../../services/authService.js';
import AdminLogin from './AdminLogin.jsx';

function AdminGuard({ children }) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    session: null,
    profile: null,
    error: '',
  });

  async function refreshAuthState() {
    setAuthState((current) => ({
      ...current,
      isLoading: true,
      error: '',
    }));

    try {
      const session = await getSession();

      if (!session) {
        setAuthState({
          isLoading: false,
          session: null,
          profile: null,
          error: '',
        });
        return;
      }

      const profile = await getCurrentProfile();

      setAuthState({
        isLoading: false,
        session,
        profile,
        error: '',
      });
    } catch {
      setAuthState({
        isLoading: false,
        session: null,
        profile: null,
        error: 'Nao foi possivel validar o acesso.',
      });
    }
  }

  useEffect(() => {
    refreshAuthState();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="admin-shell">
        <p className="admin-loading">Carregando acesso...</p>
      </div>
    );
  }

  if (!authState.session) {
    return <AdminLogin onAuthenticated={refreshAuthState} />;
  }

  if (!authState.profile?.can_edit_magazine) {
    return (
      <main className="admin-shell">
        <section className="admin-denied">
          <p className="admin-kicker">Acesso restrito</p>
          <h1>Acesso negado</h1>
          <p>Este usuario nao tem permissao para editar a Revista Ellen Paiva.</p>
        </section>
      </main>
    );
  }

  return children({ profile: authState.profile, refreshAuthState });
}

export default AdminGuard;


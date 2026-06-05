import { useState } from 'react';
import { signIn } from '../../services/authService.js';

function AdminLogin({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      await onAuthenticated();
    } catch {
      setError('Nao foi possivel entrar. Verifique e-mail e senha.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div className="admin-login-panel">
        <p className="admin-kicker">Revista Ellen Paiva</p>
        <h1 id="admin-login-title">Acesso editorial</h1>
        <p>Entre para gerenciar apenas os posts da Revista.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="admin-message admin-message-error">{error}</p>}

          <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;


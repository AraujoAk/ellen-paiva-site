import { useState } from 'react';
import { signIn, signUpEditor } from '../../services/authService.js';
import { getEmailValidation, logEmailValidationDebug, normalizeEmailInput } from '../../utils/emailValidation.js';

function AdminLogin({ initialError = '', onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [successMessage, setSuccessMessage] = useState('');
  const isSignupMode = mode === 'signup';

  function logAdminSignupDebug(stage, payload = {}) {
    if (!import.meta.env.DEV) {
      return;
    }

    console.info(`[admin-signup-flow] ${stage}`, payload);
  }

  function applyError(message, source) {
    if (import.meta.env.DEV) {
      console.info('[admin-login-set-error]', {
        source,
        message,
        mode,
        isSignupMode,
      });
    }

    setError(message);
  }

  function resetMessages() {
    setError('');
    setSuccessMessage('');
  }

  function updateLoginField(field, value) {
    setLoginData((current) => ({
      ...current,
      [field]: value,
    }));
    resetMessages();
  }

  function updateSignupField(field, value) {
    setSignupData((current) => ({
      ...current,
      [field]: value,
    }));
    resetMessages();
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    resetMessages();
    logAdminSignupDebug('switch-mode', { nextMode });
  }

  function validateSignup() {
    logAdminSignupDebug('validateSignup:start');

    if (!signupData.name.trim()) {
      return 'Informe seu nome.';
    }

    const emailValidation = getEmailValidation(signupData.email);
    logEmailValidationDebug('admin-signup', emailValidation);

    if (!emailValidation.isValid) {
      logAdminSignupDebug('validateSignup:invalid-email', emailValidation);
      return 'Informe um e-mail válido.';
    }

    if (signupData.password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (signupData.password !== signupData.confirmPassword) {
      return 'A confirmação de senha precisa ser igual à senha.';
    }

    return '';
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      await signIn(loginData.email, loginData.password);
      await onAuthenticated();
    } catch {
      applyError('Não foi possível entrar. Verifique e-mail e senha.', 'login-submit-catch');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    resetMessages();
    logAdminSignupDebug('handleSignupSubmit:called', {
      emailRaw: signupData.email,
      emailNormalized: normalizeEmailInput(signupData.email),
    });

    const validationError = validateSignup();

    if (validationError) {
      applyError(validationError, 'signup-local-validation');
      return;
    }

    setIsLoading(true);

    try {
      await signUpEditor({
        ...signupData,
        email: normalizeEmailInput(signupData.email),
      });
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setSuccessMessage('Cadastro recebido. Aguarde aprovação para acessar a área editorial.');
      setMode('login');
    } catch (signupError) {
      applyError(signupError.message || 'Não foi possível concluir o cadastro.', 'signup-submit-catch');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div className="admin-login-panel">
        <p className="admin-kicker">Revista Ellen Paiva</p>
        <h1 id="admin-login-title">Acesso editorial</h1>
        <p>
          {isSignupMode
            ? 'Solicite acesso para colaborar com os conteúdos da Revista.'
            : 'Entre para gerenciar apenas os posts da Revista.'}
        </p>

        <div className="admin-auth-tabs" aria-label="Escolha o modo de acesso">
          <button
            className={!isSignupMode ? 'is-active' : ''}
            type="button"
            onClick={() => switchMode('login')}
            disabled={isLoading}
          >
            Entrar
          </button>
          <button
            className={isSignupMode ? 'is-active' : ''}
            type="button"
            onClick={() => switchMode('signup')}
            disabled={isLoading}
          >
            Solicitar acesso editorial
          </button>
        </div>

        {isSignupMode ? (
          <form className="admin-form" onSubmit={handleSignupSubmit} noValidate>
            <label>
              Nome
              <input
                type="text"
                autoComplete="name"
                value={signupData.name}
                onChange={(event) => updateSignupField('name', event.target.value)}
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                autoComplete="email"
                value={signupData.email}
                onChange={(event) => updateSignupField('email', event.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                autoComplete="new-password"
                value={signupData.password}
                onChange={(event) => updateSignupField('password', event.target.value)}
                minLength="6"
                required
              />
            </label>

            <label>
              Confirmar senha
              <input
                type="password"
                autoComplete="new-password"
                value={signupData.confirmPassword}
                onChange={(event) => updateSignupField('confirmPassword', event.target.value)}
                minLength="6"
                required
              />
            </label>

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Criar acesso editorial'}
            </button>

            <p className="admin-auth-note">O cadastro não libera acesso automático. A aprovação é feita pela equipe.</p>
          </form>
        ) : (
          <form className="admin-form" onSubmit={handleLoginSubmit} noValidate>
            <label>
              E-mail
              <input
                type="email"
                autoComplete="email"
                value={loginData.email}
                onChange={(event) => updateLoginField('email', event.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={(event) => updateLoginField('password', event.target.value)}
                required
              />
            </label>

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default AdminLogin;

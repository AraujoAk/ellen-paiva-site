import { useState } from 'react';
import {
  requestPasswordReset,
  signIn,
  signUpEditor,
  updateCurrentUserPassword,
} from '../../services/authService.js';
import { getEmailValidation, logEmailValidationDebug, normalizeEmailInput } from '../../utils/emailValidation.js';

function PasswordField({
  autoComplete,
  label,
  minLength,
  onChange,
  value,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label>
      {label}
      <span className="admin-password-field">
        <input
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          minLength={minLength}
          required
        />
        <button
          className="admin-password-toggle"
          type="button"
          aria-label={isVisible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? 'Ocultar' : 'Mostrar'}
        </button>
      </span>
    </label>
  );
}

function AdminLogin({ initialError = '', onAuthenticated }) {
  const isResetRoute = window.location.pathname === '/admin/reset-password';
  const [mode, setMode] = useState(isResetRoute ? 'reset' : 'login');
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
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [successMessage, setSuccessMessage] = useState('');
  const isSignupMode = mode === 'signup';
  const isForgotMode = mode === 'forgot';
  const isResetMode = mode === 'reset';

  function logAdminSignupDebug(stage, payload = {}) {
    if (!import.meta.env.DEV) {
      return;
    }

    console.info(`[admin-signup-flow] ${stage}`, payload);
  }

  function applyError(message, source, originalError = null) {
    if (import.meta.env.DEV) {
      console.info('[admin-login-set-error]', {
        source,
        message,
        mode,
        errorMessage: originalError?.message,
        errorCode: originalError?.code,
        errorStatus: originalError?.status,
        errorName: originalError?.name,
        authStage: originalError?.authStage,
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

  function validateEmail(value) {
    const emailValidation = getEmailValidation(value);
    logEmailValidationDebug(`admin-${mode}`, emailValidation);

    return emailValidation;
  }

  function validateSignup() {
    logAdminSignupDebug('validateSignup:start');

    if (!signupData.name.trim()) {
      return 'Informe seu nome.';
    }

    const emailValidation = validateEmail(signupData.email);

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

  function validateResetPassword() {
    if (resetData.password.length < 6) {
      return 'A nova senha deve ter pelo menos 6 caracteres.';
    }

    if (resetData.password !== resetData.confirmPassword) {
      return 'A confirmação da nova senha precisa ser igual à senha.';
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
    } catch (loginError) {
      applyError('Não foi possível entrar. Verifique e-mail e senha.', 'login-submit-catch', loginError);
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
      applyError(signupError.message || 'Não foi possível concluir o cadastro.', 'signup-submit-catch', signupError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    resetMessages();

    const emailValidation = validateEmail(forgotEmail);

    if (!emailValidation.isValid) {
      applyError('Informe um e-mail válido.', 'forgot-local-validation');
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset(emailValidation.emailNormalized);
      setForgotEmail('');
      setSuccessMessage('Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
    } catch (forgotError) {
      applyError(
        forgotError.message || 'Não foi possível enviar o e-mail de recuperação agora. Tente novamente em instantes.',
        'forgot-submit-catch',
        forgotError,
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault();
    resetMessages();

    const validationError = validateResetPassword();

    if (validationError) {
      applyError(validationError, 'reset-local-validation');
      return;
    }

    setIsLoading(true);

    try {
      await updateCurrentUserPassword(resetData.password);
      setResetData({
        password: '',
        confirmPassword: '',
      });
      setSuccessMessage('Senha atualizada com sucesso. Faça login novamente.');
      window.history.replaceState({}, '', '/admin');
      setMode('login');
    } catch (resetError) {
      applyError(resetError.message || 'Não foi possível atualizar a senha.', 'reset-submit-catch', resetError);
    } finally {
      setIsLoading(false);
    }
  }

  function getIntroText() {
    if (isSignupMode) {
      return 'Solicite acesso para colaborar com os conteúdos da Revista.';
    }

    if (isForgotMode) {
      return 'Informe seu e-mail para receber as instruções de recuperação.';
    }

    if (isResetMode) {
      return 'Defina uma nova senha para voltar à área editorial.';
    }

    return 'Entre para gerenciar apenas os posts da Revista.';
  }

  return (
    <section className="admin-login" aria-labelledby="admin-login-title">
      <div className="admin-login-panel">
        <p className="admin-kicker">Revista Ellen Paiva</p>
        <h1 id="admin-login-title">Acesso editorial</h1>
        <p>{getIntroText()}</p>

        {!isResetMode && (
          <div className="admin-auth-tabs" aria-label="Escolha o modo de acesso">
            <button
              className={mode === 'login' ? 'is-active' : ''}
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
        )}

        {isSignupMode && (
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

            <PasswordField
              label="Senha"
              autoComplete="new-password"
              value={signupData.password}
              onChange={(event) => updateSignupField('password', event.target.value)}
              minLength="6"
            />

            <PasswordField
              label="Confirmar senha"
              autoComplete="new-password"
              value={signupData.confirmPassword}
              onChange={(event) => updateSignupField('confirmPassword', event.target.value)}
              minLength="6"
            />

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Criar acesso editorial'}
            </button>

            <p className="admin-auth-note">O cadastro não libera acesso automático. A aprovação é feita pela equipe.</p>
          </form>
        )}

        {mode === 'login' && (
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

            <PasswordField
              label="Senha"
              autoComplete="current-password"
              value={loginData.password}
              onChange={(event) => updateLoginField('password', event.target.value)}
            />

            <button
              className="admin-inline-link"
              type="button"
              onClick={() => switchMode('forgot')}
              disabled={isLoading}
            >
              Esqueceu sua senha?
            </button>

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}

        {isForgotMode && (
          <form className="admin-form" onSubmit={handleForgotSubmit} noValidate>
            <label>
              E-mail
              <input
                type="email"
                autoComplete="email"
                value={forgotEmail}
                onChange={(event) => {
                  setForgotEmail(event.target.value);
                  resetMessages();
                }}
                required
              />
            </label>

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar instruções'}
            </button>
            <button className="admin-button admin-button-secondary" type="button" onClick={() => switchMode('login')}>
              Voltar para login
            </button>
          </form>
        )}

        {isResetMode && (
          <form className="admin-form" onSubmit={handleResetSubmit} noValidate>
            <PasswordField
              label="Nova senha"
              autoComplete="new-password"
              value={resetData.password}
              onChange={(event) => {
                setResetData((current) => ({
                  ...current,
                  password: event.target.value,
                }));
                resetMessages();
              }}
              minLength="6"
            />

            <PasswordField
              label="Confirmar nova senha"
              autoComplete="new-password"
              value={resetData.confirmPassword}
              onChange={(event) => {
                setResetData((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }));
                resetMessages();
              }}
              minLength="6"
            />

            {error && <p className="admin-message admin-message-error">{error}</p>}
            {successMessage && <p className="admin-message admin-message-success">{successMessage}</p>}

            <button className="admin-button admin-button-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
            <button className="admin-button admin-button-secondary" type="button" onClick={() => switchMode('login')}>
              Voltar para login
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default AdminLogin;

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';
import { normalizeEmailInput } from '../utils/emailValidation.js';

const authErrorMessages = [
  {
    match: /already registered|already exists|user already/i,
    message: 'Este e-mail já possui cadastro.',
  },
  {
    match: /password/i,
    message: 'A senha deve ter pelo menos 6 caracteres.',
  },
  {
    match: /invalid email|email address is invalid|unable to validate email|valid email/i,
    message: 'Informe um e-mail válido.',
  },
  {
    match: /signup|signups|not allowed|disabled/i,
    message: 'O cadastro editorial nao esta habilitado no Supabase Auth. Verifique Authentication > Providers.',
  },
  {
    match: /database error saving new user|error saving new user|saving user/i,
    message: 'O Supabase Auth nao conseguiu salvar o usuario. Verifique triggers, constraints ou configuracoes de Auth.',
  },
  {
    match: /confirmation|confirm|smtp|mailer|send.*email|email.*send/i,
    message: 'Nao foi possivel enviar a confirmacao por e-mail. Verifique as configuracoes de Auth/SMTP no Supabase.',
  },
  {
    match: /rate limit|too many requests|security purposes/i,
    message: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.',
  },
  {
    match: /permission|policy|rls|row-level security|violates row-level/i,
    message: 'Não foi possível criar o perfil pendente. Verifique a policy de cadastro no Supabase.',
  },
  {
    match: /check constraint|profiles_role_check/i,
    message: 'O papel editor ainda não está liberado na constraint de profiles.',
  },
];

function toFriendlyAuthError(error, fallbackMessage) {
  const rawMessage = error?.message || String(error || '');
  const matchedError = authErrorMessages.find((item) => item.match.test(rawMessage));
  const friendlyMessage = matchedError?.message || fallbackMessage || 'Não foi possível concluir o cadastro.';

  if (import.meta.env.DEV && rawMessage) {
    return new Error(`${friendlyMessage} [DEV: ${rawMessage}]`);
  }

  return new Error(friendlyMessage);
}

function logAuthError(context, error) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.error(`[admin-auth] ${context}`, {
    message: error?.message,
    code: error?.code,
    status: error?.status,
    name: error?.name,
    details: error?.details,
    hint: error?.hint,
  });
}

function attachAuthStage(error, stage) {
  if (error && typeof error === 'object') {
    error.authStage = stage;
  }

  return error;
}

export async function signIn(email, password) {
  const client = await getSupabaseClient();

  if (!client) {
    const configError = new Error('Supabase nao configurado.');
    throw attachAuthStage(configError, 'getSupabaseClient');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: normalizeEmailInput(email),
    password,
  });

  if (error) {
    logAuthError('signInWithPassword', error);
    throw attachAuthStage(error, 'signInWithPassword');
  }

  return data;
}

export async function requestPasswordReset(email) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const redirectTo = `${window.location.origin}/admin/reset-password`;
  const { data, error } = await client.auth.resetPasswordForEmail(normalizeEmailInput(email), {
    redirectTo,
  });

  if (error) {
    logAuthError('requestPasswordReset', error);
    throw toFriendlyAuthError(error, 'Nao foi possivel enviar o e-mail de recuperacao agora.');
  }

  return data;
}

export async function updateCurrentUserPassword(password) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client.auth.updateUser({
    password,
  });

  if (error) {
    logAuthError('updateCurrentUserPassword', error);
    throw toFriendlyAuthError(error, 'Nao foi possivel atualizar a senha.');
  }

  await signOut();

  return data;
}

export async function createPendingProfile({ userId, name, email }) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const profilePayload = {
    id: userId,
    email,
    name: name.trim(),
    role: 'editor',
    can_edit_magazine: false,
  };

  const { error } = await client.from('profiles').insert(profilePayload);

  if (error) {
    logAuthError('createPendingProfile', error);
    throw toFriendlyAuthError(error, 'Não foi possível criar o perfil pendente.');
  }
}

export async function signUpEditor({ name, email, password }) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const normalizedEmail = normalizeEmailInput(email);

  if (import.meta.env.DEV) {
    console.info('[admin-auth] signUpEditor:request', {
      email: normalizedEmail,
      nameLength: name.trim().length,
      passwordLength: password.length,
    });
  }

  const { data, error } = await client.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        name: name.trim(),
        role: 'editor',
      },
    },
  });

  if (error) {
    logAuthError('signUpEditor', error);
    throw toFriendlyAuthError(error, 'Não foi possível criar o acesso editorial.');
  }

  const userId = data.user?.id;
  const authEmail = data.user?.email;

  if (!userId || !authEmail) {
    throw new Error('Cadastro iniciado. Confirme seu e-mail antes de solicitar aprovação.');
  }

  if (!data.session) {
    throw new Error(
      'Cadastro criado no Auth, mas o Supabase exige confirmação de e-mail antes de criar o perfil pendente.',
    );
  }

  await createPendingProfile({
    userId,
    name,
    email: authEmail,
  });

  await signOut();

  return data;
}

export async function signOut() {
  const client = await getSupabaseClient();

  if (!client) {
    return;
  }

  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getSession() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const client = await getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getSession();

  if (error) {
    logAuthError('getSession', error);
    throw attachAuthStage(error, 'getSession');
  }

  return data.session;
}

export async function getCurrentUser() {
  const client = await getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getUser();

  if (error) {
    logAuthError('getUser', error);
    throw attachAuthStage(error, 'getUser');
  }

  return data.user;
}

export async function getProfileByUserId(userId) {
  if (!userId) {
    return null;
  }

  const client = await getSupabaseClient();

  const { data, error } = await client
    .from('profiles')
    .select('id, email, name, role, can_edit_magazine')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    logAuthError('profiles.select.current', error);
    throw attachAuthStage(error, 'profiles.select.current');
  }

  return data;
}

export async function getCurrentProfile(user = null) {
  const currentUser = user || (await getCurrentUser());

  if (!currentUser) {
    return null;
  }

  return getProfileByUserId(currentUser.id);
}

export async function getMagazineAccessStatus() {
  const client = await getSupabaseClient();

  if (!client) {
    return false;
  }

  const { data, error } = await client.rpc('can_edit_magazine');

  if (error) {
    logAuthError('can_edit_magazine.rpc', error);
    throw attachAuthStage(error, 'can_edit_magazine.rpc');
  }

  return Boolean(data);
}

export function createFallbackProfileFromSessionUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email || 'Editor',
    role: user.user_metadata?.role || 'editor',
    can_edit_magazine: true,
    isFallbackProfile: true,
  };
}

export async function canEditMagazine() {
  try {
    const profile = await getCurrentProfile();
    return Boolean(profile?.can_edit_magazine);
  } catch {
    return getMagazineAccessStatus();
  }
}

export async function listPendingEditors() {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client
    .from('profiles')
    .select('id, email, name, role, can_edit_magazine, created_at')
    .eq('role', 'editor')
    .eq('can_edit_magazine', false)
    .order('created_at', { ascending: false });

  if (error) {
    logAuthError('listPendingEditors', error);
    throw toFriendlyAuthError(error, 'Nao foi possivel carregar as solicitacoes editoriais.');
  }

  return data ?? [];
}

export async function approveEditor(profileId) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client
    .from('profiles')
    .update({
      can_edit_magazine: true,
    })
    .eq('id', profileId)
    .eq('role', 'editor')
    .select('id, email, name, role, can_edit_magazine')
    .single();

  if (error) {
    logAuthError('approveEditor', error);
    throw toFriendlyAuthError(error, 'Nao foi possivel aprovar este editor.');
  }

  return data;
}

export async function rejectEditor(profileId) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client
    .from('profiles')
    .update({
      can_edit_magazine: false,
    })
    .eq('id', profileId)
    .eq('role', 'editor')
    .select('id, email, name, role, can_edit_magazine')
    .single();

  if (error) {
    logAuthError('rejectEditor', error);
    throw toFriendlyAuthError(error, 'Nao foi possivel reprovar este editor.');
  }

  return data;
}

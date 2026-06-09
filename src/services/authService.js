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

export async function signIn(email, password) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

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
    throw error;
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
    throw error;
  }

  return data.user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const client = await getSupabaseClient();

  const { data, error } = await client
    .from('profiles')
    .select('id, email, name, role, can_edit_magazine')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function canEditMagazine() {
  const profile = await getCurrentProfile();
  return Boolean(profile?.can_edit_magazine);
}

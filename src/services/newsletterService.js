import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const newsletterMessages = {
  success: 'Inscrição realizada com sucesso.',
  duplicate: 'Este e-mail já está cadastrado.',
  invalidEmail: 'Informe um e-mail válido.',
  unavailable: 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
};

function normalizeLead({ name, email, source }) {
  return {
    name: name?.trim() || null,
    email: email?.trim().toLowerCase() || '',
    source: source || 'landing-newsletter',
    status: 'active',
  };
}

function isDuplicateEmailError(error) {
  const message = error?.message || String(error || '');
  return error?.code === '23505' || /duplicate|unique|already exists/i.test(message);
}

export async function subscribeToNewsletter(lead) {
  const payload = normalizeLead(lead);

  if (!EMAIL_PATTERN.test(payload.email)) {
    return {
      ok: false,
      message: newsletterMessages.invalidEmail,
    };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: newsletterMessages.unavailable,
    };
  }

  const client = await getSupabaseClient();

  if (!client) {
    return {
      ok: false,
      message: newsletterMessages.unavailable,
    };
  }

  const { error } = await client.from('newsletter_subscribers').insert(payload);

  if (!error) {
    return {
      ok: true,
      message: newsletterMessages.success,
    };
  }

  if (isDuplicateEmailError(error)) {
    return {
      ok: false,
      message: newsletterMessages.duplicate,
    };
  }

  return {
    ok: false,
    message: newsletterMessages.unavailable,
  };
}

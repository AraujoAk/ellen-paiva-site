const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

export function normalizeEmailInput(value = '') {
  return String(value)
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .toLowerCase();
}

export function getEmailValidation(value) {
  const emailRaw = String(value ?? '');
  const emailNormalized = normalizeEmailInput(emailRaw);
  const regexResult = EMAIL_PATTERN.test(emailNormalized);
  const reason = !emailNormalized ? 'empty_email' : regexResult ? '' : 'regex_mismatch';

  return {
    emailRaw,
    emailNormalized,
    regexResult,
    reason,
    isValid: Boolean(emailNormalized && regexResult),
  };
}

export function isValidEmail(value) {
  return getEmailValidation(value).isValid;
}

export function logEmailValidationDebug(context, validation) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.info(`[email-validation] ${context}`, {
    emailRaw: validation.emailRaw,
    emailNormalized: validation.emailNormalized,
    regexResult: validation.regexResult,
    reason: validation.reason || 'accepted',
  });
}

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormValidationResult =
  | { ok: true; error: null }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: Partial<ContactFormValues>): ContactFormValidationResult {
  const name = (input.name ?? '').trim();
  const email = (input.email ?? '').trim();
  const message = (input.message ?? '').trim();

  if (!name || !EMAIL_PATTERN.test(email) || !message) {
    return {
      ok: false,
      error: 'Name is required, a valid email is required, and a message is required.',
    };
  }

  return { ok: true, error: null };
}

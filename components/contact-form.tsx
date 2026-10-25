'use client';

import {useState} from 'react';
import {translations, type Locale} from '@/lib/i18n';

export default function ContactForm({locale}: {locale: Locale}) {
  const t = translations[locale];
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch('/api/contact', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
      if (!response.ok) throw new Error('contact_failed');
      setSent(true);
    } catch { setError(t.error); } finally { setLoading(false); }
  }

  if (sent) return <div className="success-box contact-success" role="status"><h2>{t.sent}</h2></div>;
  return <form className="quote-form contact-form" onSubmit={submit}>
    <div className="form-grid">
      <label>{t.name}<input required name="name" autoComplete="name" /></label>
      <label>{t.email}<input required type="email" name="email" autoComplete="email" /></label>
      <label>{t.phone}<input name="phone" autoComplete="tel" /></label>
    </div>
    <label>{t.message}<textarea required name="message" rows={6} /></label>
    <button disabled={loading} className="action-primary" type="submit">{loading ? '…' : t.send} ↗</button>
    {error && <p className="form-error" role="alert">{error}</p>}
  </form>;
}

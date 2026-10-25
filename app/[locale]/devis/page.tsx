'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {translations, type Locale} from '@/lib/i18n';
import WhatsAppButton from '@/components/whatsapp-button';

export default function QuotePage() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith('/ar') ? 'ar' : 'fr';
  const ar = locale === 'ar';
  const t = translations[locale];
  const params = useSearchParams();
  const selectedProduct = params.get('product') || '';
  const selectedProductName = params.get('productName') || '';
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const productId = String(form.get('productId') || '').trim();
    const quantity = Math.max(1, Math.min(100, Number(form.get('quantity') || 1)));
    const details = [
      `${ar ? 'المنتج المختار' : 'Produit sélectionné'}: ${form.get('productLabel') || '—'}`,
      `${ar ? 'الكمية' : 'Quantité'}: ${quantity}`,
      `${ar ? 'نوع المشروع' : 'Type de projet'}: ${form.get('projectType') || '—'}`,
      `${ar ? 'الرسالة' : 'Message'}: ${form.get('message') || '—'}`,
    ].join('\n');
    const payload = {customerName: String(form.get('customerName') || ''), company: String(form.get('company') || ''), email: String(form.get('email') || ''), phone: String(form.get('phone') || ''), message: details, items: productId ? [{productId, quantity}] : []};
    try {
      const response = await fetch('/api/quotations', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
      if (!response.ok) throw new Error('quote_failed');
      setSent(true);
    } catch { setError(t.error); } finally { setLoading(false); }
  }

  return <main id="main-content" className="quote-page"><section className="form-head"><span className="section-kicker">WIPLAY PRO · 03</span><h1>{t.yourProject}</h1><p>{t.heroBody}</p></section>{sent ? <div className="success-box"><h2>{t.sent}</h2><p>{ar ? 'سيتواصل معكم فريقنا قريبًا.' : 'Notre équipe vous contactera rapidement.'}</p></div> : <form className="quote-form" onSubmit={submit}><p className="form-intro">{ar ? 'أخبرونا عن مشروعكم وسيتواصل معكم فريقنا في أقرب وقت.' : 'Décrivez votre projet. Notre équipe vous répond rapidement avec une proposition adaptée.'}</p><div className="quote-step-summary"><span><b>01</b>{ar ? 'بيانات الشركة' : 'Vos coordonnées'}</span><span><b>02</b>{ar ? 'تفاصيل المشروع' : 'Votre projet'}</span><span><b>03</b>{ar ? 'المتابعة' : 'Notre réponse'}</span></div><div className="form-grid"><label>{t.companyName}<input required name="company" autoComplete="organization" /></label><label>{t.name}<input required name="customerName" autoComplete="name" /></label><label>{t.email}<input required type="email" name="email" autoComplete="email" /></label><label>{t.phone}<input required name="phone" autoComplete="tel" /></label><label>{ar ? 'المنتج المختار' : 'Produit sélectionné'}<input name="productLabel" defaultValue={selectedProductName} placeholder={ar ? 'اسم المنتج أو المرجع' : 'Nom du produit ou référence'} /></label><label>{ar ? 'الكمية' : 'Quantité'}<input required type="number" min="1" max="100" defaultValue="1" name="quantity" /></label><label>{ar ? 'نوع المشروع' : 'Type de projet'}<select required name="projectType" defaultValue=""><option value="" disabled>{ar ? 'اختر نوع المشروع' : 'Choisir un type de projet'}</option><option value="public">{ar ? 'فضاء عمومي' : 'Espace public'}</option><option value="school">{ar ? 'مدرسة أو مؤسسة' : 'École ou établissement'}</option><option value="hotel">{ar ? 'فندق أو منتجع' : 'Hôtel ou resort'}</option><option value="private">{ar ? 'مشروع خاص' : 'Projet privé'}</option></select></label></div>{selectedProduct && <input type="hidden" name="productId" value={selectedProduct} />}<label>{t.message}<textarea required name="message" rows={6} /></label><div className="quote-actions"><button disabled={loading} className="action-primary" type="submit">{loading ? '…' : t.send} ↗</button><WhatsAppButton request={ar ? 'أرغب في إرسال طلب عرض سعر.' : 'Je souhaite envoyer une demande de devis.'} /></div>{error && <p className="form-error" role="alert">{error}</p>}</form>}</main>;
}

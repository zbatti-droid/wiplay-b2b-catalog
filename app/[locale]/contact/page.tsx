import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {isLocale, translations, type Locale} from '@/lib/i18n';
import WhatsAppButton from '@/components/whatsapp-button';
import ContactForm from '@/components/contact-form';

export const dynamic = 'force-dynamic';

export default async function Contact({params}: {params: Promise<{locale: string}>}) {
  const {locale: rawLocale} = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const ar = locale === 'ar';
  const t = translations[locale];
  const settings = await db.settings.findUnique({where: {id: 1}, select: {companyName: true, phone: true, email: true, siteUrl: true}}).catch(() => null);
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS?.trim() || '';
  const location = process.env.NEXT_PUBLIC_COMPANY_LOCATION?.trim() || address;
  const hours = process.env.NEXT_PUBLIC_COMPANY_HOURS?.trim() || '';
  const phone = settings?.phone || process.env.NEXT_PUBLIC_COMPANY_PHONE?.trim() || '';
  const email = settings?.email || process.env.NEXT_PUBLIC_COMPANY_EMAIL?.trim() || '';
  const mapQuery = process.env.NEXT_PUBLIC_GOOGLE_MAPS_QUERY?.trim() || location;
  const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.trim() || (mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : '');
  const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() || (mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : '');

  return <main id="main-content" className="contact-page">
    <section className="form-head contact-head"><span className="section-kicker">WIPLAY PRO</span><h1>{t.contactUs}</h1><p>{ar ? 'فريقنا جاهز لمرافقة مشروعكم من الفكرة إلى التركيب.' : 'Notre équipe vous accompagne de l’étude à l’installation.'}</p><WhatsAppButton request={ar ? 'أرغب في التواصل مع فريقكم.' : 'Je souhaite contacter votre équipe.'} /></section>
    <section className="contact-layout">
      <div className="contact-form-column"><div className="contact-section-intro"><span className="section-kicker">01 / {ar ? 'مراسلتنا' : 'ÉCRIVEZ-NOUS'}</span><h2>{ar ? 'لنبدأ الحديث عن مشروعكم.' : 'Parlons de votre projet.'}</h2><p>{ar ? 'أرسلوا لنا تفاصيل احتياجاتكم، وسيتواصل معكم فريق Wiplay.' : 'Partagez-nous les besoins de votre site. L’équipe Wiplay vous répondra rapidement.'}</p></div><ContactForm locale={locale}/></div>
      <aside className="contact-map-column" aria-label={ar ? 'معلومات الموقع والخريطة' : 'Coordonnées et carte'}>
        <div className="contact-info-grid">
          {phone && <article><span className="section-kicker">{ar ? 'الهاتف' : 'Téléphone'}</span><a dir="ltr" href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></article>}
          {email && <article><span className="section-kicker">{ar ? 'البريد الإلكتروني' : 'Email'}</span><a href={`mailto:${email}`}>{email}</a></article>}
          {hours && <article><span className="section-kicker">{ar ? 'أوقات العمل' : 'Horaires'}</span><p>{hours}</p></article>}
          {(address || location) && <article><span className="section-kicker">{ar ? 'العنوان' : 'Adresse'}</span><p>{address || location}</p></article>}
        </div>
        <div className="contact-map-card"><div className="contact-map-heading"><div><span className="section-kicker">02 / {ar ? 'موقعنا' : 'NOUS TROUVER'}</span><h2>{ar ? 'موقع Wiplay' : 'Retrouvez Wiplay'}</h2></div><span className="map-pin" aria-hidden="true">⌖</span></div>{embedUrl ? <div className="contact-map-frame"><iframe title={ar ? 'خريطة موقع Wiplay' : 'Carte de localisation Wiplay'} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div> : <div className="contact-map-empty"><span aria-hidden="true">⌖</span><p>{ar ? 'سيظهر موقع الشركة هنا بعد إضافة رابط Google Maps.' : 'La carte apparaîtra ici dès que le lien Google Maps de l’entreprise sera configuré.'}</p></div>}{mapsUrl && <a className="map-open-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">{ar ? 'فتح الموقع في Google Maps' : 'Ouvrir dans Google Maps'} <span aria-hidden="true">↗</span></a>}</div>
        {settings?.companyName && <p className="contact-company-note">{settings.companyName}{settings.siteUrl ? ` · ${settings.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : ''}</p>}
      </aside>
    </section>
  </main>;
}

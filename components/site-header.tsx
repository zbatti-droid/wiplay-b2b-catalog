'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {translations, type Locale} from '@/lib/i18n';

export default function SiteHeader() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith('/ar') ? 'ar' : 'fr';
  const ar = locale === 'ar';
  const t = translations[locale];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const home = pathname === `/${locale}` || pathname === '/';
  const opposite = ar ? 'fr' : 'ar';
  const changed = pathname.match(/^\/(fr|ar)(?=\/|$)/) ? pathname.replace(/^\/(fr|ar)/, `/${opposite}`) : `/${opposite}`;
  const links = [[`/${locale}`, t.home], [`/${locale}/catalogue`, t.catalogue], [`/${locale}/#projects`, t.projects], [`/${locale}/#about`, t.company], [`/${locale}/contact`, t.contact]];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update(); window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  return <header className={`manufacturer-header ${home && !scrolled && !open ? 'over-hero' : ''}`}>
    <Link className="skip-link" href="#main-content">{ar ? 'انتقل إلى المحتوى' : 'Aller au contenu'}</Link>
    <div className="manufacturer-nav">
      <Link className="manufacturer-brand" href={`/${locale}`} aria-label="Wiplay Pro"><span dir="ltr">wiplay<span className="brand-dot">.</span></span><small>{ar ? 'فضاءات للحياة' : 'Des espaces à vivre'}</small></Link>
      <nav className="desktop-navigation" aria-label={ar ? 'التنقل الرئيسي' : 'Navigation principale'}>
        {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <div className="manufacturer-tools">
        <Link className="language-link" href={changed} onClick={event => {event.preventDefault(); window.location.assign(changed + window.location.search + window.location.hash);}} lang={opposite} hrefLang={opposite}>{ar ? 'FR' : 'العربية'}</Link>
        <Link className="nav-quote" href={`/${locale}/devis`}>{t.quote}<span aria-hidden="true">↗</span></Link>
        <button ref={toggle} className="nav-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={ar ? (open ? 'إغلاق القائمة' : 'فتح القائمة') : (open ? 'Fermer le menu' : 'Ouvrir le menu')} onClick={() => setOpen(!open)}>{open ? '×' : '☰'}</button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" className="manufacturer-mobile" aria-label={ar ? 'قائمة الهاتف' : 'Navigation mobile'} initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} transition={{duration: reduced ? 0 : 0.2}}>
      {links.map(([href,label], i) => <Link key={href} href={href} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}<span aria-hidden="true">↗</span></Link>)}
      <Link href={`/${locale}/devis`} onClick={() => setOpen(false)}>{t.quote}<span aria-hidden="true">↗</span></Link>
    </motion.nav>}</AnimatePresence>
  </header>;
}

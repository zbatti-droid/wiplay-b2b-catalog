import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {translations, isLocale, categoryAr, categoryDescriptionAr} from '@/lib/i18n';
import {publicProducts} from '@/lib/public-data';
import {media, categories} from '@/lib/catalog';
import {DbProductCard} from '@/components/db-product-card';
import DbWhatsAppButton from '@/components/db-whatsapp-button';
export const dynamic = 'force-dynamic';

export default async function LocalizedHome({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === 'ar';
  const t = translations[locale];
  const [products, projects, testimonials] = await Promise.all([
    publicProducts(4),
    db.project.findMany({include: {images: true}, take: 3, orderBy: {createdAt: 'desc'}}),
    db.testimonial.findMany({take: 3, orderBy: {createdAt: 'desc'}}),
  ]);
  const sectors = ar ? ['الجماعات والحدائق', 'المدارس ودور الحضانة', 'الفنادق والمنتجعات', 'المهندسون المعماريون'] : ['Collectivités & parcs', 'Écoles & crèches', 'Hôtels & resorts', 'Architectes & promoteurs'];
  return <main className="manufacturer-home" id="main-content">
    <section className="cinema-hero" data-hero>
      <div className="cinema-photo" data-parallax><Image src={media.park} alt={ar ? 'فضاء ألعاب مجهز في حديقة عمومية' : 'Aire de jeux aménagée dans un parc public'} fill priority sizes="100vw" /></div>
      <div className="cinema-shade" />
      <div className="cinema-copy">
        <span className="eyebrow" data-hero-badge>{ar ? 'اللعب. الحركة. اللقاء.' : 'JOUER. BOUGER. SE RETROUVER.'}</span>
        <h1 data-hero-title>{t.heroTitle}<span className="hero-period">.</span></h1>
        <p data-hero-copy>{ar ? 'تصنيع وتركيب تجهيزات اللعب والرياضة الخارجية والأثاث الحضري.' : 'Fabrication et installation d’équipements de jeux, fitness extérieur et mobilier urbain.'}</p>
        <div className="cinema-actions" data-hero-actions><Link className="action-primary" href={`/${locale}/catalogue`}>{t.viewCatalogue}<span aria-hidden>↗</span></Link><Link className="hero-outline" href={`/${locale}/devis`}>{t.quote}<span aria-hidden>↗</span></Link></div>
      </div>
      <div className="hero-caption"><span>{ar ? 'تجهيزات للفضاءات العامة' : 'ÉQUIPEMENTS POUR ESPACES PUBLICS'}</span><a href="#ranges">{ar ? 'اكتشف حلولنا' : 'Explorer nos solutions'} <span aria-hidden>↓</span></a></div>
    </section>
    <div className="sector-ribbon">{sectors.map((sector, i) => <span key={sector}><small>0{i + 1}</small>{sector}</span>)}</div>
    <section className="editorial-section ranges-section" id="ranges">
      <div className="editorial-heading" data-motion="fade"><div><span className="eyebrow">01 / {ar ? 'حلولنا' : 'NOS UNIVERS'}</span><h2>{ar ? 'لكل فضاء، إمكانيات جديدة.' : 'À chaque espace, de nouvelles possibilités.'}</h2></div><p>{ar ? 'تجهيزات متكاملة لتحويل المساحات إلى أماكن للعب والحركة واللقاء.' : 'Une gamme complète pour transformer les espaces en lieux de jeu, de mouvement et de rencontre.'}</p></div>
      <div className="range-grid" data-motion="stagger">{categories.slice(0,3).map((c,i) => <Link key={c.slug} className="range-feature" href={`/${locale}/catalogue?category=${c.slug}`}><div className="range-image"><Image src={c.image} alt={ar ? categoryAr[c.slug] : c.title} fill sizes="(max-width:700px) 100vw,33vw"/><span className="range-number">0{i+1}</span></div><div className="range-heading"><h3>{ar ? categoryAr[c.slug] : c.title}</h3><span aria-hidden>↗</span></div><p>{ar ? categoryDescriptionAr[c.slug] : c.description}</p></Link>)}</div>
      <div className="range-index">{categories.slice(3).map(c => <Link key={c.slug} href={`/${locale}/catalogue?category=${c.slug}`}>{ar ? categoryAr[c.slug] : c.title}<span aria-hidden>↗</span></Link>)}</div>
    </section>
    <section className="editorial-section product-selection"><div className="editorial-heading" data-motion="fade"><div><span className="eyebrow">02 / {ar ? 'الكتالوج' : 'LE CATALOGUE'}</span><h2>{t.featured}</h2></div><Link className="text-link" href={`/${locale}/catalogue`}>{t.allProducts} <span aria-hidden>↗</span></Link></div>{products.length ? <div className="industry-product-grid" data-motion="stagger">{products.map(product => <DbProductCard key={product.id} product={product} locale={locale}/>)}</div> : <p className="empty-state">{t.empty}</p>}</section>
    <section className="expertise-section" id="about"><div className="expertise-photo" data-motion="image"><Image src={media.hero} alt={ar ? 'أطفال يستمتعون باللعب في الهواء الطلق' : 'Des enfants profitent d’une aire de jeux en plein air'} fill sizes="(max-width:800px) 100vw,50vw"/></div><div className="expertise-copy" data-motion="fade"><span className="eyebrow">03 / {ar ? 'خبرتنا' : 'NOTRE APPROCHE'}</span><h2>{ar ? 'مساحات تجمعنا. تجهيزات تدوم.' : 'Des lieux qui rassemblent. Des équipements qui durent.'}</h2><p>{ar ? 'من اختيار التجهيزات إلى التركيب، نرافقكم لتصميم فضاء يناسب موقعكم واستخداماته.' : 'Du choix des équipements à leur installation, nous vous accompagnons pour concevoir un espace adapté à votre site et à ses usages.'}</p><div className="expertise-steps">{(ar ? ['فهم احتياجات مشروعكم', 'اختيار التجهيزات المناسبة', 'مرافقة التركيب والصيانة'] : ['Comprendre votre projet', 'Choisir les équipements adaptés', 'Accompagner la pose et l’entretien']).map((label,i) => <div key={label}><span>0{i+1}</span><h3>{label}</h3></div>)}</div><Link className="text-link" href={`/${locale}/contact`}>{t.contactUs} ↗</Link></div></section>
    <section className="editorial-section project-editorial" id="projects"><div className="editorial-heading" data-motion="fade"><div><span className="eyebrow">04 / {ar ? 'المشاريع' : 'LES RÉALISATIONS'}</span><h2>{ar ? 'من الفكرة إلى مكان للحياة.' : 'Du projet au lieu de vie.'}</h2></div><p>{ar ? 'اكتشفوا فضاءات اللعب والرياضة والراحة ومعلومات كل مشروع.' : 'Découvrez les espaces de jeu, de sport et de détente, et les détails de chaque projet.'}</p></div>{projects.length ? <div className="project-editorial-grid">{projects.map((project,i) => <article key={project.id} className="project-feature" data-motion="fade"><div className="project-feature-image">{project.images[0] && <Image src={project.images[0].url} alt={ar ? project.titleAr || project.title : project.titleFr || project.title} fill sizes={i===0 ? '(max-width:800px) 100vw,85vw' : '(max-width:800px) 100vw,42vw'}/>}<span className="project-position">0{i+1}</span></div><div className="project-feature-copy"><div><span className="eyebrow">{project.location}</span><h3>{ar ? project.titleAr || project.title : project.titleFr || project.title}</h3></div><p>{ar ? project.descriptionAr || project.description : project.descriptionFr || project.description}</p></div></article>)}</div> : <div className="project-inspiration"><Image src={media.park} alt={ar ? 'مثال توضيحي لتهيئة حديقة عمومية' : 'Photographie d’inspiration pour l’aménagement d’un parc'} fill sizes="90vw"/><div><span className="eyebrow">{ar ? 'إلهام للتهيئة' : 'INSPIRATION D’AMÉNAGEMENT'}</span><h3>{ar ? 'تخيلوا إمكانيات فضائكم.' : 'Imaginez le potentiel de votre espace.'}</h3><Link className="hero-outline" href={`/${locale}/devis`}>{t.quote} ↗</Link></div></div>}</section>
    {testimonials.length > 0 && <section className="editorial-section testimonials-live"><div className="editorial-heading"><h2>{ar ? 'كلمات من عملائنا' : 'La parole à nos clients'}</h2></div><div className="testimonial-grid">{testimonials.map(item => <blockquote key={item.id}><span className="quote-mark" aria-hidden>“</span><p>{item.comment}</p><footer>{item.name} · {item.company}</footer></blockquote>)}</div></section>}
    <section className="project-cta" data-motion="fade"><span className="eyebrow">{ar ? 'لنبنِ مشروعكم معًا' : 'CONSTRUISONS VOTRE PROJET'}</span><div><h2>{t.yourProject}<span> ?</span></h2><Link className="round-link" href={`/${locale}/devis`} aria-label={t.quote}>↗</Link></div><div className="cta-actions"><Link className="action-primary" href={`/${locale}/devis`}>{t.quote} ↗</Link><DbWhatsAppButton request={ar ? 'أرغب في مناقشة مشروع تجهيز فضاء.' : 'Je souhaite échanger sur un projet d’aménagement.'}/></div></section>
  </main>;
}

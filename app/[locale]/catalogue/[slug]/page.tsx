import Link from 'next/link';
import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {isLocale,translations} from '@/lib/i18n';
import {productName,productDescription,categoryName} from '@/lib/public-data';
import DbWhatsAppButton from '@/components/db-whatsapp-button';
import ProductGallery from '@/components/product-gallery';
import {DbProductCard} from '@/components/db-product-card';
import {media} from '@/lib/catalog';

export const dynamic='force-dynamic';

export default async function ProductDetail({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale,slug}=await params;
  if(!isLocale(locale))notFound();
  const t=translations[locale];
  const product=await db.product.findUnique({where:{slug},include:{category:true,images:{orderBy:{createdAt:'asc'}}}});
  if(!product||!product.active)notFound();
  const related=await db.product.findMany({where:{active:true,categoryId:product.categoryId,id:{not:product.id}},include:{category:true,images:{orderBy:{createdAt:'asc'}}},take:3,orderBy:{createdAt:'desc'}});
  const name=productName(product,locale);
  const description=productDescription(product,locale);
  const specificationEntries=product.specifications&&typeof product.specifications==='object'&&!Array.isArray(product.specifications)
    ? Object.entries(product.specifications as Record<string,unknown>).filter(([,value])=>value!==null&&value!==undefined&&String(value).trim()!=='').map(([key,value])=>[key,typeof value==='object'?JSON.stringify(value):String(value)] as const)
    : [];
  const productJsonLd={"@context":"https://schema.org","@type":"Product",name,description,sku:product.reference,category:categoryName(product.category,locale),image:product.images.map(image=>image.url),brand:{"@type":"Brand",name:'Wiplay Pro'}};
  const breadcrumbJsonLd={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:t.home,item:`/${locale}`},{"@type":"ListItem",position:2,name:t.catalogue,item:`/${locale}/catalogue`},{"@type":"ListItem",position:3,name}]};
  return <main className="manufacturer-detail" id="main-content">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(productJsonLd)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbJsonLd)}}/>
    <div className="breadcrumbs" data-motion="fade"><Link href={`/${locale}`}>{t.home}</Link><span>›</span><Link href={`/${locale}/catalogue`}>{t.catalogue}</Link><span>›</span><span>{name}</span></div>
    <section className="detail">
      <ProductGallery images={product.images} name={name} locale={locale}/>
      <div className="detail-copy" data-motion="fade">
        <span className="section-kicker">{categoryName(product.category,locale)} · {t.reference} {product.reference}</span>
        <h1>{name}</h1><p className="detail-lead">{description}</p>
        <h2 className="spec-heading">{t.specs}</h2><div className="spec-list">{[[t.age,product.ageGroup],[t.environment,product.environment],[t.materials,product.material],...specificationEntries.map(([label,value])=>[label,value] as const)].map(([label,value])=><div key={label}><span>{label}</span><b>{value||'—'}</b></div>)}</div>
        <div className="product-actions"><Link className="action-primary wide" href={`/${locale}/devis?product=${product.id}&productName=${encodeURIComponent(name)}`}>{t.quote} ↗</Link><DbWhatsAppButton product={name} reference={product.reference} category={categoryName(product.category,locale)} request={description}/></div>
      </div>
    </section>
    <section className="detail-assurance" data-motion="fade"><div><span className="section-kicker">WIPLAY PRO</span><h2>{locale==='ar'?'من الفكرة إلى التركيب':'De la conception à l’installation'}</h2><p className="service-intro">{locale==='ar'?'نرافق مشروعكم بخبرة تقنية واضحة ومسار عمل منظم.':'Une méthode claire pour transformer votre besoin en espace durable.'}</p></div><div className="assurance-points service-grid" data-motion="stagger"><article><span className="service-icon" aria-hidden="true">⌖</span><b>01</b><h3>{locale==='ar'?'تركيب احترافي':'Installation professionnelle'}</h3><p>{locale==='ar'?'دراسة المشروع، التوصيل، التركيب ومراقبة الجودة.':'Étude du projet, livraison, montage et contrôle qualité.'}</p></article><article><span className="service-icon" aria-hidden="true">↗</span><b>02</b><h3>{locale==='ar'?'طلب عرض سعر':'Demande de devis'}</h3><p>{locale==='ar'?'نموذج بسيط، واتساب، واستجابة سريعة.':'Un formulaire simple, WhatsApp et une réponse rapide.'}</p></article><article><span className="service-icon" aria-hidden="true">＋</span><b>03</b><h3>{locale==='ar'?'مرافقة المشروع':'Accompagnement projet'}</h3><p>{locale==='ar'?'من التصميم إلى التركيب، يبقى فريقنا إلى جانبكم.':'De la conception à la pose, notre équipe reste à vos côtés.'}</p></article></div></section>
    <section className="detail-projects" data-motion="fade"><div className="industry-heading"><div><span className="section-kicker">WIPLAY PRO</span><h2>{locale==='ar'?'أفكار لتهيئة الفضاءات':'Inspirations d’aménagement'}</h2></div></div><div className="detail-project-grid"><article><div><img src={media.park} alt={locale==='ar'?'مثال لتهيئة حديقة':'Inspiration pour un parc'} /></div><span>{locale==='ar'?'حديقة عمومية':'Parc public'}</span></article><article><div><img src={media.playground} alt={locale==='ar'?'مثال لفضاء لعب':'Inspiration pour une aire de jeux'} /></div><span>{locale==='ar'?'مؤسسة تعليمية':'Projet scolaire'}</span></article></div></section>    {related.length>0&&<section className="industry-section related-products" data-motion="fade"><div className="industry-heading"><h2>{locale==='ar'?'منتجات ذات صلة':'Produits associés'}</h2><Link className="section-more" href={`/${locale}/catalogue`}>{t.allProducts} ↗</Link></div><div className="industry-product-grid" data-motion="stagger">{related.map(item=><DbProductCard key={item.id} product={item} locale={locale}/>)}</div></section>}
    <section className="detail-bottom" data-motion="fade"><div><span className="section-kicker">WIPLAY PRO</span><h2>{t.custom}</h2></div><p>{t.contactUs}</p></section>
  </main>;
}

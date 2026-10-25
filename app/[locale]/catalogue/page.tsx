import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { isLocale, translations, categoryAr } from '@/lib/i18n';
import { categoryName } from '@/lib/public-data';
import { DbProductCard } from '@/components/db-product-card';

export const dynamic = 'force-dynamic';

export default async function Catalogue({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    material?: string;
    age?: string;
    environment?: string;
  }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const query = await searchParams;

  const t = translations[locale];

  const requestedPage = Number(query.page || 1);
  const page = Number.isFinite(requestedPage)
    ? Math.min(10000, Math.max(1, Math.floor(requestedPage)))
    : 1;
  const take = 12;

  const q = (query.q || '').trim().slice(0, 80);
  const category = (query.category || '').trim().slice(0, 120);

  const material = (query.material || '').slice(0, 100);
  const age = (query.age || '').slice(0, 100);
  const environment = (query.environment || '').slice(0, 100);

  const where = {
    ...(material ? {material} : {}),
    ...(age ? {ageGroup: age} : {}),
    ...(environment ? {environment} : {}),
    active: true,
    ...(q
      ? {
          OR: [
            {
              name: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
            {
              nameFr: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
            {nameAr: {contains: q, mode: 'insensitive' as const}},
            {
              reference: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}),
    ...(category
      ? {
          category: {
            slug: category,
          },
        }
      : {}),
  };

  const [categories, products, total, facets] = await Promise.all([
    db.category.findMany({
      orderBy: {
        name: 'asc',
      },
      take: 100,
    }),

    db.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      skip: (page - 1) * take,
      take,
      orderBy:
        query.sort === 'alpha'
          ? {
              name: 'asc',
            }
          : {
              createdAt: 'desc',
            },
    }),

    db.product.count({where}),
    db.product.findMany({where:{active:true}, select:{material:true, ageGroup:true, environment:true}, distinct:['material','ageGroup','environment']}),
  ]);

  const pages = Math.max(1, Math.ceil(total / take));

  const href = (changes: Record<string, string>) => {
    const p = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(material ? {material} : {}),
      ...(age ? {age} : {}),
      ...(environment ? {environment} : {}),
      ...(category ? { category } : {}),
      ...(query.sort ? { sort: query.sort } : {}),
      ...changes,
    });

    return `/${locale}/catalogue?${p.toString()}`;
  };

  const options = (key: 'material' | 'ageGroup' | 'environment') => [...new Set(facets.map(f => f[key]).filter((v): v is string => Boolean(v)))];
  const activeFilters = [['q', q], ['category', category ? categoryName(categories.find(c => c.slug === category) || {name:category,nameFr:null,nameAr:null},locale) : ''], ['material', material], ['age', age], ['environment', environment]].filter(([,value]) => value);
  return <main id="main-content" className="manufacturer-catalogue">
    <section className="catalog-hero"><div><span className="eyebrow">WIPLAY PRO / {locale==='ar'?'تجهيزات مهنية':'ÉQUIPEMENTS PROFESSIONNELS'}</span><h1>{t.catalogue}<span className="hero-period">.</span></h1></div><p>{locale==='ar'?'ابحثوا عن التجهيزات المناسبة لمشروعكم. تصفحوا الفئات وقارنوا المواد والفئات العمرية وأماكن التركيب.':'Trouvez les équipements adaptés à votre projet. Explorez les gammes, les matériaux et les usages.'}</p></section>
    <section className="catalog-layout">
      <aside><details className="catalog-filters" open><summary>{t.filter}<span aria-hidden>＋</span></summary>
        <form method="GET" action={`/${locale}/catalogue`}>
          <label>{t.search}<input name="q" defaultValue={q} placeholder={t.searchPlaceholder}/></label>
          {category && <input type="hidden" name="category" value={category}/>}
          {query.sort && <input type="hidden" name="sort" value={query.sort}/>}
          <div className="filter-category-list"><span className="filter-caption">{t.categories}</span><Link className={!category?'is-active':''} href={href({category:'',page:'1'})}>{t.allProducts}</Link>{categories.map(c=><Link key={c.id} className={category===c.slug?'is-active':''} href={href({category:c.slug,page:'1'})}>{locale==='ar'?categoryAr[c.slug]||categoryName(c,locale):categoryName(c,locale)}</Link>)}</div>
          {([{key:'material',field:'material',label:t.materials,value:material},{key:'age',field:'ageGroup',label:t.age,value:age},{key:'environment',field:'environment',label:t.environment,value:environment}] as const).map(f=><label key={f.key}>{f.label}<select name={f.key} defaultValue={f.value}><option value="">{locale==='ar'?'الكل':'Tous'}</option>{options(f.field).map(value=><option key={value} value={value}>{value}</option>)}</select></label>)}
          <button className="action-primary" type="submit">{locale==='ar'?'تطبيق الفلاتر':'Appliquer les filtres'}</button><Link className="clear-filters" href={`/${locale}/catalogue`}>{locale==='ar'?'إعادة ضبط الفلاتر':'Réinitialiser les filtres'}</Link>
        </form>
      </details></aside>
      <div><div className="catalog-top"><span><strong>{total}</strong> {t.products}</span><form method="GET">{Object.entries({q,category,material,age,environment}).map(([key,value])=>value?<input key={key} type="hidden" name={key} value={value}/>:null)}<select name="sort" defaultValue={query.sort||'recent'} aria-label={t.sort}><option value="recent">{t.recent}</option><option value="alpha">{t.alpha}</option></select><button type="submit" className="action-primary">{t.sort}</button></form></div>
        {activeFilters.length>0&&<div className="filter-chip-row">{activeFilters.map(([key,value])=><Link key={key} href={href({[key]:'',page:'1'})} aria-label={`${locale==='ar'?'إزالة':'Retirer'} ${value}`}>{value}<span aria-hidden>×</span></Link>)}</div>}
        {products.length?<div className="industry-product-grid">{products.map(product=><DbProductCard key={product.id} product={product} locale={locale}/>)}</div>:<div className="empty-state"><p>{t.noProducts}</p><Link href={`/${locale}/catalogue`}>{t.allProducts}</Link></div>}
        <nav className="pagination" aria-label={locale==='ar'?'صفحات الكتالوج':'Pages du catalogue'}>{page>1&&<Link href={href({page:String(page-1)})}>{t.previous}</Link>}<span>{page} / {pages}</span>{page<pages&&<Link href={href({page:String(page+1)})}>{t.next}</Link>}</nav>
      </div>
    </section>
  </main>;
}

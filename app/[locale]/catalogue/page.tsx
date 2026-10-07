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
  }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const query = await searchParams;

  const t = translations[locale];

  const page = Math.max(1, Number(query.page || 1));
  const take = 12;

  const q = (query.q || '').trim().slice(0, 80);
  const category = (query.category || '').trim().slice(0, 120);

  const where = {
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

  const [categories, products, total] = await Promise.all([
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

    db.product.count({
      where,
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / take));

  const href = (changes: Record<string, string>) => {
    const p = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
      ...(query.sort ? { sort: query.sort } : {}),
      ...changes,
    });

    return `/${locale}/catalogue?${p.toString()}`;
  };

  return (
    <main>
      <section className="catalog-hero">
        <span className="section-kicker">WIPLAY PRO</span>

        <h1>{t.catalogue}</h1>

        <p>{t.heroBody}</p>
      </section>


      <nav className="catalog-nav">

        <Link
          className={!category ? 'active' : ''}
          href={`/${locale}/catalogue`}
        >
          {t.allProducts}
        </Link>


        {categories.map((c) => (
          <Link
            key={c.id}
            className={category === c.slug ? 'active' : ''}
            href={href({
              category: c.slug,
              page: '1',
            })}
          >
            {locale === 'ar'
              ? categoryAr[c.slug] || c.name
              : categoryName(c, locale)}
          </Link>
        ))}

      </nav>


      <section className="catalog-layout">


        <aside>

          <p className="section-kicker">
            {t.filter}
          </p>


          <form>

            <label>

              {t.search}

              <input
                name="q"
                defaultValue={q}
                placeholder={t.searchPlaceholder}
              />

            </label>


            {category && (
              <input
                type="hidden"
                name="category"
                value={category}
              />
            )}


            <button
              className="action-primary"
              type="submit"
            >
              {t.search}
            </button>


          </form>


        </aside>



        <div>


          <div className="catalog-top">

            <span>
              {total} {t.products}
            </span>



            <form method="GET">

              {q && (
                <input
                  type="hidden"
                  name="q"
                  value={q}
                />
              )}


              {category && (
                <input
                  type="hidden"
                  name="category"
                  value={category}
                />
              )}



              <select
                name="sort"
                defaultValue={query.sort || 'recent'}
                aria-label={t.sort}
              >

                <option value="recent">
                  {t.recent}
                </option>


                <option value="alpha">
                  {t.alpha}
                </option>


              </select>



              <button
                type="submit"
                className="action-primary"
              >
                OK
              </button>


            </form>


          </div>





          {products.length ? (

            <div className="industry-product-grid">

              {products.map((p) => (

                <DbProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                />

              ))}

            </div>


          ) : (

            <p>
              {t.noProducts}
            </p>

          )}






          <div className="pagination">


            {page > 1 && (

              <Link href={href({
                page: String(page - 1),
              })}>
                {t.previous}
              </Link>

            )}



            <span>
              {page} / {pages}
            </span>



            {page < pages && (

              <Link href={href({
                page: String(page + 1),
              })}>
                {t.next}
              </Link>

            )}



          </div>


        </div>


      </section>


    </main>
  );
}
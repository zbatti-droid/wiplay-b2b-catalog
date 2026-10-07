import Image from 'next/image';
import Link from 'next/link';
import type {Locale} from '@/lib/i18n';
import {translations} from '@/lib/i18n';
import {productName,categoryName} from '@/lib/public-data';
import type {Product,Category,ProductImage} from '@prisma/client';
export function DbProductCard({product,locale}:{product:Product&{category:Category;images:ProductImage[]};locale:Locale}){const t=translations[locale];const name=productName(product,locale);return <article className="product-card industry-product"><Link className="product-card-image" href={`/${locale}/catalogue/${product.slug}`} aria-label={name}>{product.images[0]&&<Image src={product.images[0].url} alt={product.images[0].alt||name} fill sizes="(max-width:600px) 100vw,(max-width:1000px) 50vw,25vw"/>}</Link><div className="product-card-body"><p className="product-ref">{categoryName(product.category,locale)}</p><Link href={`/${locale}/catalogue/${product.slug}`}><h3>{name}</h3></Link><p className="product-code">{t.reference} {product.reference} · {product.material||product.environment||''}</p><Link className="add-quote" href={`/${locale}/devis?product=${product.id}`}>{t.quote} <span aria-hidden>↗</span></Link></div></article>}

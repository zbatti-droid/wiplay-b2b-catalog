import Image from 'next/image';
import Link from 'next/link';
import {translations, type Locale} from '@/lib/i18n';
import {productName, productDescription, categoryName} from '@/lib/public-data';
import type {Product, Category, ProductImage} from '@prisma/client';
export function DbProductCard({product, locale}: {product: Product & {category: Category; images: ProductImage[]}; locale: Locale}) {
  const t = translations[locale];
  const name = productName(product, locale);
  return <article className="product-card industry-product">
    <Link className="product-card-image" href={`/${locale}/catalogue/${product.slug}`} aria-label={name}>
      {product.images[0] ? <Image src={product.images[0].url} alt={name} fill sizes="(max-width:600px) 100vw,(max-width:1000px) 50vw,30vw"/> : <span className="image-unavailable">{locale === 'ar' ? 'الصورة قيد الإضافة' : 'Visuel à venir'}</span>}
      <span className="product-image-arrow" aria-hidden>↗</span>
    </Link>
    <div className="product-card-body"><p className="product-ref">{categoryName(product.category, locale)}</p><Link href={`/${locale}/catalogue/${product.slug}`}><h3>{name}</h3></Link><p className="product-summary">{productDescription(product,locale)}</p><p className="product-code">{t.reference} <bdi>{product.reference}</bdi></p><Link className="add-quote" href={`/${locale}/devis?product=${product.id}&productName=${encodeURIComponent(name)}`}>{t.quote}<span aria-hidden>↗</span></Link></div>
  </article>;
}

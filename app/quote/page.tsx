import {redirect} from 'next/navigation';

export default async function QuoteRedirect({searchParams}: {searchParams: Promise<{product?: string}>}) {
  const {product} = await searchParams;
  const query = product ? `?productName=${encodeURIComponent(product.slice(0, 160))}` : '';
  redirect(`/fr/devis${query}`);
}

import {MetadataRoute} from 'next';
import {db} from '@/lib/db';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';let products:{slug:string}[]=[];try{products=await db.product.findMany({where:{active:true},select:{slug:true}})}catch{}const pages=['','/catalogue','/contact','/devis'];return ['fr','ar'].flatMap(locale=>[...pages.map(path=>({url:`${base}/${locale}${path}`,changeFrequency:'weekly' as const,priority:path===''?1:.7})),...products.map(p=>({url:`${base}/${locale}/catalogue/${p.slug}`,changeFrequency:'monthly' as const,priority:.6}))])}

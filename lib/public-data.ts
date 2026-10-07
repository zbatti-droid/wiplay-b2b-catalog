import {db} from '@/lib/db';
import type {Locale} from '@/lib/i18n';
export function productName(product:{name:string;nameFr:string|null;nameAr:string|null},locale:Locale){return locale==='ar'?product.nameAr||product.nameFr||product.name:product.nameFr||product.name}
export function productDescription(product:{description:string;descriptionFr:string|null;descriptionAr:string|null},locale:Locale){return locale==='ar'?product.descriptionAr||product.descriptionFr||product.description:product.descriptionFr||product.description}
export function categoryName(category:{name:string;nameFr:string|null;nameAr:string|null},locale:Locale){return locale==='ar'?category.nameAr||category.nameFr||category.name:category.nameFr||category.name}
export async function publicCategories(){return db.category.findMany({orderBy:{name:'asc'},take:100})}
export async function publicProducts(limit=8){return db.product.findMany({where:{active:true},include:{category:true,images:{orderBy:{createdAt:'asc'}}},take:limit,orderBy:{createdAt:'desc'}})}

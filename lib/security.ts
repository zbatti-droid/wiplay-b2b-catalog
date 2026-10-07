import {NextResponse} from 'next/server';
import {z} from 'zod';
import {randomUUID} from 'node:crypto';

const buckets = new Map<string,{count:number;reset:number}>();
function pruneBuckets(now:number){if(buckets.size<10000)return;for(const [key,value] of buckets){if(value.reset<=now)buckets.delete(key)}}
export function clientIp(req:Request){return (req.headers.get('x-forwarded-for')||req.headers.get('x-real-ip')||'unknown').split(',')[0].trim().slice(0,64)}
export function rateLimit(key:string,limit:number,windowMs:number){const now=Date.now();pruneBuckets(now);const current=buckets.get(key);if(!current||current.reset<=now){buckets.set(key,{count:1,reset:now+windowMs});return {ok:true,remaining:limit-1,reset:now+windowMs}}current.count++;return {ok:current.count<=limit,remaining:Math.max(0,limit-current.count),reset:current.reset}}
export function rateResponse(reset:number){return NextResponse.json({error:'Too many requests'},{status:429,headers:{'Retry-After':String(Math.max(1,Math.ceil((reset-Date.now())/1000)))}})}
export function assertSameOrigin(req:Request){const origin=req.headers.get('origin');if(!origin)return true;try{return new URL(origin).origin===new URL(req.url).origin}catch{return false}}
export function cleanText(value:string,max:number){return value.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/<[^>]*>/g,'').trim().slice(0,max)}
export const email=z.string().trim().email().max(254).transform(v=>v.toLowerCase());
export const id=z.string().cuid().max(32);
export const safeUrl=z.string().trim().max(2048).refine(v=>(v.startsWith('/')&&!v.startsWith('//')&&!v.toLowerCase().endsWith('.svg'))||/^https:\/\//i.test(v),'Invalid URL');
export const quoteSchema=z.strictObject({customerName:z.string().trim().min(2).max(120),email,phone:z.string().trim().min(6).max(30),company:z.string().trim().max(160).optional().nullable(),message:z.string().trim().max(5000).optional().nullable(),items:z.array(z.strictObject({productId:id,quantity:z.number().int().min(1).max(100)})).max(50).default([])});
export const contactSchema=z.strictObject({name:z.string().trim().min(2).max(120),email,phone:z.string().trim().max(30).optional().nullable(),message:z.string().trim().min(2).max(5000)});
export const productSchema=z.strictObject({name:z.string().trim().min(2).max(160),nameFr:z.string().trim().max(160).optional().nullable(),nameAr:z.string().trim().max(160).optional().nullable(),descriptionFr:z.string().trim().max(10000).optional().nullable(),descriptionAr:z.string().trim().max(10000).optional().nullable(),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),reference:z.string().trim().min(2).max(80),description:z.string().trim().min(2).max(10000),specifications:z.record(z.string(),z.union([z.string().max(1000),z.number(),z.boolean()])).optional(),material:z.string().trim().max(160).optional().nullable(),ageGroup:z.string().trim().max(80).optional().nullable(),environment:z.string().trim().max(80).optional().nullable(),categoryId:id,images:z.array(safeUrl).max(20).default([]),active:z.boolean().optional()});
export const categorySchema=z.strictObject({name:z.string().trim().min(2).max(120),nameFr:z.string().trim().max(120).optional().nullable(),nameAr:z.string().trim().max(120).optional().nullable(),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),image:safeUrl.optional().nullable(),description:z.string().trim().max(1000).optional().nullable()});
export const projectSchema=z.strictObject({title:z.string().trim().min(2).max(180),titleFr:z.string().trim().max(180).optional().nullable(),titleAr:z.string().trim().max(180).optional().nullable(),descriptionFr:z.string().trim().max(10000).optional().nullable(),descriptionAr:z.string().trim().max(10000).optional().nullable(),location:z.string().trim().min(2).max(180),description:z.string().trim().max(10000).optional().nullable(),images:z.array(safeUrl).max(30).default([])});
export function jsonError(message:string,status=400){return NextResponse.json({error:message},{status})}
export function safeJson<T>(schema:z.ZodSchema<T>,body:unknown){const parsed=schema.safeParse(body);return parsed.success?{data:parsed.data}:{error:jsonError('Invalid request data',400)}}
export function storageName(original:string){const ext=original.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)?.[1]||'bin';return `${Date.now()}-${randomUUID()}.${ext==='jpeg'?'jpg':ext}`}

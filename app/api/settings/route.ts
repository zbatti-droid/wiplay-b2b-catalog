import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {requireAdmin} from '@/lib/guards';
import {audit} from '@/lib/audit';
import {z} from 'zod';
const settingsSchema=z.strictObject({companyName:z.string().trim().min(2).max(120).optional(),whatsappNumber:z.string().trim().regex(/^\+?[0-9 ()-]{8,25}$/).nullable().optional(),phone:z.string().trim().max(30).nullable().optional(),email:z.string().email().nullable().optional(),siteUrl:z.string().url().nullable().optional()});
export async function GET(){const settings=await db.settings.findUnique({where:{id:1}});return NextResponse.json({companyName:settings?.companyName||'WIPLAY PRO',whatsappNumber:settings?.whatsappNumber||process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||null,phone:settings?.phone||null,email:settings?.email||null,siteUrl:settings?.siteUrl||process.env.NEXT_PUBLIC_SITE_URL||null})}
export async function PATCH(req:Request){const guard=await requireAdmin(req);if(guard.error)return guard.error;const parsed=settingsSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid settings'},{status:400});const settings=await db.settings.upsert({where:{id:1},create:{id:1,...parsed.data},update:parsed.data});await audit('UPDATE',guard.email,req,'Settings','1');return NextResponse.json(settings)}

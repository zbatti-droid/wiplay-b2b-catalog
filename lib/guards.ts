import {NextResponse} from 'next/server';
import {getAdminSession} from '@/lib/auth';
import {assertSameOrigin} from '@/lib/security';
import {db} from '@/lib/db';
export async function requireAdmin(req:Request){const email=await getAdminSession();if(!email)return {error:NextResponse.json({error:'Unauthorized'},{status:401})};if(!assertSameOrigin(req))return {error:NextResponse.json({error:'Invalid origin'},{status:403})};try{const user=await db.user.findUnique({where:{email},select:{role:true}});if(user&&user.role!=='ADMIN')return {error:NextResponse.json({error:'Admin role required'},{status:403})}}catch{}return {email}}

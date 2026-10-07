import {db} from '@/lib/db';
export async function audit(action:string,userEmail:string,req:Request,entity?:string,entityId?:string){try{await db.adminActivityLog.create({data:{action,userEmail,entity:entity||null,entityId:entityId||null,ip:(req.headers.get('x-forwarded-for')||req.headers.get('x-real-ip')||'').split(',')[0].slice(0,64)}})}catch{/* audit must never break a business request */}}

import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {requireAdmin} from '@/lib/guards';
import {audit} from '@/lib/audit';
import {id as idSchema,jsonError} from '@/lib/security';
import {z} from 'zod';
const status=z.enum(['PENDING','CONTACTED','COMPLETED']);
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  const guard=await requireAdmin(req);if(guard.error)return guard.error;
  const {id}=await params;if(!idSchema.safeParse(id).success)return jsonError('Invalid id');
  try{
    const body=await req.json();const parsed=status.safeParse(body?.status);if(!parsed.success)return jsonError('Invalid status');
    const q=await db.quotation.update({where:{id},data:{status:parsed.data}});
    await audit('UPDATE',guard.email,req,'Quotation',id);return NextResponse.json(q);
  }catch{return jsonError('Quotation not found',404)}
}

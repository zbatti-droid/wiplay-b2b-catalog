import {NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
import {requireAdmin} from '@/lib/guards';
import {audit} from '@/lib/audit';
import {id as idSchema,jsonError} from '@/lib/security';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){const guard=await requireAdmin(req);if(guard.error)return guard.error;const {id}=await params;if(!idSchema.safeParse(id).success)return jsonError('Invalid id');const parsed=z.strictObject({read:z.boolean()}).safeParse(await req.json());if(!parsed.success)return jsonError('Invalid message status');const message=await db.contactMessage.update({where:{id},data:parsed.data});await audit('UPDATE',guard.email,req,'ContactMessage',id);return NextResponse.json(message)}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){const guard=await requireAdmin(req);if(guard.error)return guard.error;const {id}=await params;if(!idSchema.safeParse(id).success)return jsonError('Invalid id');await db.contactMessage.delete({where:{id}});await audit('DELETE',guard.email,req,'ContactMessage',id);return NextResponse.json({ok:true})}

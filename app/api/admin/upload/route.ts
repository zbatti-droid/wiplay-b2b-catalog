import {NextResponse} from 'next/server';import crypto from 'node:crypto';import sharp from 'sharp';import {requireAdmin} from '@/lib/guards';import {audit} from '@/lib/audit';
const MAX=5*1024*1024;const allowed=new Set(['image/jpeg','image/png','image/webp']);
function validSignature(bytes:Uint8Array,type:string){if(type==='image/jpeg')return bytes[0]===0xff&&bytes[1]===0xd8;if(type==='image/png')return bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47;if(type==='image/webp')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';return false}
export async function POST(req:Request){const guard=await requireAdmin(req);if(guard.error)return guard.error;const length=Number(req.headers.get('content-length')||0);if(length>MAX+200000)return NextResponse.json({error:'File too large'},{status:413});const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'File missing'},{status:400});if(file.size>MAX||!allowed.has(file.type))return NextResponse.json({error:'Only JPG, PNG and WEBP images up to 5MB are allowed'},{status:415});const input=Buffer.from(await file.arrayBuffer());if(!validSignature(input,file.type))return NextResponse.json({error:'Invalid image content'},{status:415});const base=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!base||!key)return NextResponse.json({error:'Storage is not configured'},{status:503});try{const output=await sharp(input,{failOnError:true}).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();const path=`${Date.now()}-${crypto.randomUUID()}.webp`;const upload=await fetch(`${base}/storage/v1/object/catalog-media/${path}`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'image/webp','x-upsert':'false'},body:new Uint8Array(output)});if(!upload.ok)return NextResponse.json({error:'Storage upload failed'},{status:502});const url=`${base}/storage/v1/object/public/catalog-media/${path}`;await audit('UPLOAD',guard.email,req,'Media',path);return NextResponse.json({url},{status:201})}catch{return NextResponse.json({error:'Unable to process image'},{status:422})}}

export async function DELETE(req:Request){
 const guard=await requireAdmin(req);if(guard.error)return guard.error;
 const base=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!base||!key)return NextResponse.json({error:'Storage is not configured'},{status:503});
 try{
  const body=await req.json();const url=typeof body?.url==='string'?body.url:'';
  const prefix=base+'/storage/v1/object/public/catalog-media/';
  if(!url.startsWith(prefix))return NextResponse.json({error:'Invalid media URL'},{status:400});
  const path=decodeURIComponent(url.slice(prefix.length));
  if(!path||path.includes('..')||path.includes('/'))return NextResponse.json({error:'Invalid media path'},{status:400});
  const response=await fetch(base+'/storage/v1/object/catalog-media',{method:'DELETE',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({prefixes:[path]})});
  if(!response.ok)return NextResponse.json({error:'Storage delete failed'},{status:502});
  await audit('DELETE',guard.email,req,'Media',path);return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Unable to delete image'},{status:400})}
}

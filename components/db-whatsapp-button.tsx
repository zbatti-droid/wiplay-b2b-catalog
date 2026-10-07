import {db} from '@/lib/db';
import WhatsAppButton from './whatsapp-button';
export default async function DbWhatsAppButton(props:{product?:string;reference?:string;request?:string;className?:string}){const settings=await db.settings.findUnique({where:{id:1},select:{whatsappNumber:true}}).catch(()=>null);return <WhatsAppButton {...props} number={settings?.whatsappNumber||process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||''}/>}

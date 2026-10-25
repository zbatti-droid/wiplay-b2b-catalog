import {db} from '@/lib/db';
import {DEFAULT_WHATSAPP_NUMBER} from '@/lib/whatsapp';
import WhatsAppButton from './whatsapp-button';
export default async function DbWhatsAppButton(props:{product?:string;reference?:string;category?:string;request?:string;className?:string}){const settings=await db.settings.findUnique({where:{id:1},select:{whatsappNumber:true}}).catch(()=>null);return <WhatsAppButton {...props} number={settings?.whatsappNumber||DEFAULT_WHATSAPP_NUMBER}/>}

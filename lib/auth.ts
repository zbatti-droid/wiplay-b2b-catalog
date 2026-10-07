import {cookies} from 'next/headers';
import {createHmac,timingSafeEqual} from 'node:crypto';
const COOKIE='wiplay_admin';
function secret(){const value=process.env.ADMIN_SESSION_SECRET;if(!value||value.length<32)throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters');return value}
function sign(value:string){return createHmac('sha256',secret()).update(value).digest('hex')}
export function createSessionValue(email:string){const value=`${Buffer.from(email).toString('base64url')}.${Date.now()}`;return `${value}.${sign(value)}`}
export function verifySessionValue(raw?:string){if(!raw)return null;try{const parts=raw.split('.');if(parts.length!==3)return null;const [encoded,issuedRaw,sig]=parts;const value=`${encoded}.${issuedRaw}`;const expected=sign(value);if(sig.length!==expected.length||!timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;const issued=Number(issuedRaw);if(!issued||issued>Date.now()||Date.now()-issued>8*60*60*1000)return null;return Buffer.from(encoded,'base64url').toString('utf8')}catch{return null}}
export async function getAdminSession(){return verifySessionValue((await cookies()).get(COOKIE)?.value)}
export const sessionCookie=COOKIE;

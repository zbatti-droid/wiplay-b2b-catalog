import {notFound} from 'next/navigation';
import {isLocale} from '@/lib/i18n';
import type {Metadata} from 'next';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  const ar=locale==='ar';
  return {title:ar?'حلول تجهيز الفضاءات العمومية':'Solutions d’aménagement pour espaces publics',description:ar?'تصميم وتجهيز وتركيب ألعاب الأطفال والرياضة الخارجية والأثاث الحضري.':'Conception, fourniture et installation d’aires de jeux, fitness extérieur et mobilier urbain.',alternates:{canonical:`/${isLocale(locale)?locale:'fr'}`,languages:{fr:'/fr',ar:'/ar'}},openGraph:{locale:ar?'ar_MA':'fr_MA'}};
}
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return children}

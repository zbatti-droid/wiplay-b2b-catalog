import {PrismaClient} from '@prisma/client';
import {hash} from 'bcryptjs';
const db=new PrismaClient();
const cats=[
 ['Aires de jeux','Playgrounds','ألعاب الأطفال','aires-de-jeux','/images/categories/hero.jpg'],
 ['Toboggans','Slides','الزحاليق','toboggans','/images/categories/playground.jpg'],
 ['Jeux sur ressort','Spring riders','ألعاب النابض','jeux-sur-ressort','/images/categories/swing.jpg'],
 ['Fitness extérieur','Outdoor fitness','الرياضة الخارجية','fitness-exterieur','/images/categories/fitness.jpg'],
 ['Mobilier urbain','Urban furniture','الأثاث الحضري','mobilier-urbain','/images/categories/bench.jpg'],
 ['Sols amortissants','Safety flooring','الأرضيات المطاطية','sols-amortissants','/images/categories/floor.jpg'],
 ['Parcs intérieurs','Indoor playgrounds','ألعاب داخلية','structures-indoor','/images/categories/indoor.jpg']
] as const;
async function main(){await db.settings.upsert({where:{id:1},update:{},create:{id:1,companyName:'WIPLAY PRO',whatsappNumber:process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||null,siteUrl:process.env.NEXT_PUBLIC_SITE_URL||null}});for(const [name,nameFr,nameAr,slug,image] of cats)await db.category.upsert({where:{slug},update:{nameFr,nameAr,image},create:{name,nameFr,nameAr,slug,image,description:'Solutions robustes pour espaces publics et privés'}});const playground=await db.category.findFirstOrThrow({where:{slug:'aires-de-jeux'}});const fitness=await db.category.findFirstOrThrow({where:{slug:'fitness-exterieur'}});const urban=await db.category.findFirstOrThrow({where:{slug:'mobilier-urbain'}});const floor=await db.category.findFirstOrThrow({where:{slug:'sols-amortissants'}});const products=[
 ['Toboggan Océan','زحليقة المحيط','toboggan-ocean','WP-0104','Structure ludique avec toboggan inox et plateforme sécurisée',playground,'/images/categories/playground.jpg'],
 ['Balançoire Duo','أرجوحة مزدوجة','balancoire-duo','WP-0210','Balançoire double avec assises ergonomiques',playground,'/images/categories/swing.jpg'],
 ['Parcours Mini Park','مسار ميني بارك','parcours-mini-park','WP-0312','Parcours compact pour écoles et collectivités',playground,'/images/categories/hero.jpg'],
 ['Station Fitness Pro','محطة اللياقة الاحترافية','station-fitness-pro','WF-0440','Station polyvalente pour entraînement collectif',fitness,'/images/categories/fitness.jpg'],
 ['Banc Horizon','مقعد هورايزون','banc-horizon','WU-1201','Assise robuste pour parcs et circulations',urban,'/images/categories/bench.jpg'],
 ['Dalles SafePlay','أرضيات SafePlay','dalles-safeplay','WS-2008','Revêtement souple pour une aire de jeux sûre',floor,'/images/categories/floor.jpg']
] as const;for(const [name,nameAr,slug,reference,description,category,image] of products)await db.product.upsert({where:{slug},update:{nameAr,descriptionFr:description,descriptionAr:description,categoryId:category.id,images:{deleteMany:{},create:[{url:image,alt:name}]}},create:{name,nameFr:name,nameAr,slug,reference,description,descriptionFr:description,descriptionAr:description,categoryId:category.id,material:'Acier galvanisé et HDPE',ageGroup:'3–12 ans',environment:'Extérieur',images:{create:[{url:image,alt:name}]}}});const email=process.env.ADMIN_EMAIL;const seedPassword=process.env.ADMIN_SEED_PASSWORD;if(email&&seedPassword){const password=await hash(seedPassword,12);await db.user.upsert({where:{email},update:{password,role:'ADMIN'},create:{name:'Wiplay Admin',email,password,role:'ADMIN'}})}else console.warn('ADMIN_SEED_PASSWORD not set: skipping admin user provisioning')}
main().finally(()=>db.$disconnect());

export type Product = {slug:string;name:string;reference:string;category:string;categorySlug:string;description:string;technical:string;image:string;images:string[];age:string;material:string;setting:string};
// Editorial photography is stored locally so the catalogue remains reliable offline.
export const media={
 hero:'/images/categories/hero.jpg',
 playground:'/images/categories/playground.jpg',
 swing:'/images/categories/swing.jpg',
 fitness:'/images/categories/fitness.jpg',
 exercise:'/images/categories/exercise.jpg',
 bench:'/images/categories/bench.jpg',
 floor:'/images/categories/floor.jpg',
 indoor:'/images/categories/indoor.jpg',
 park:'/images/categories/park.jpg',
};
export const categories=[
 {slug:'aires-de-jeux',title:'Aires de jeux',description:'Structures pour écoles, jardins et collectivités.',image:media.hero},
 {slug:'fitness-exterieur',title:'Fitness extérieur',description:'Équipements sportifs pour espaces ouverts.',image:media.fitness},
 {slug:'mobilier-urbain',title:'Mobilier urbain',description:'Assises et aménagements pour espaces publics.',image:media.bench},
 {slug:'sols-amortissants',title:'Sols amortissants',description:'Revêtements pour les zones de jeu et de sport.',image:media.floor},
 {slug:'structures-indoor',title:'Parcs intérieurs',description:'Espaces ludiques couverts pour les familles.',image:media.indoor},
 {slug:'toboggans',title:'Toboggans',description:'Équipements de glisse pour tous les âges.',image:media.playground},
 {slug:'jeux-sur-ressort',title:'Jeux sur ressort',description:'Premières sensations pour les plus jeunes.',image:media.swing},
];
export const products:Product[]=[
 {slug:'toboggan-ocean',name:'Toboggan Océan',reference:'WP-0104',category:'Toboggans',categorySlug:'toboggans',description:'Structure de glisse pour cour d’école et parc public.',technical:'Plateforme accessible · glissière monobloc',image:media.swing,images:[media.swing,media.hero],age:'3–12 ans',material:'Acier galvanisé, panneaux HDPE',setting:'Extérieur'},
 {slug:'balancoire-duo',name:'Balançoire Duo',reference:'WP-0210',category:'Aires de jeux',categorySlug:'aires-de-jeux',description:'Deux postes de jeu pour les espaces collectifs.',technical:'Deux assises · structure renforcée',image:media.playground,images:[media.playground,media.hero],age:'3–12 ans',material:'Acier galvanisé, chaînes inox',setting:'Extérieur'},
 {slug:'parcours-mini-park',name:'Parcours Mini Park',reference:'WP-0312',category:'Aires de jeux',categorySlug:'aires-de-jeux',description:'Parcours compact pensé pour les cours et jardins.',technical:'Jeu combiné · faible emprise au sol',image:media.hero,images:[media.hero,media.playground],age:'2–8 ans',material:'Acier galvanisé, panneaux HDPE',setting:'Extérieur'},
 {slug:'station-fitness-pro',name:'Station Fitness Pro',reference:'WF-0440',category:'Fitness extérieur',categorySlug:'fitness-exterieur',description:'Station polyvalente pour l’entraînement collectif.',technical:'Postes multiples · implantation en parc',image:media.fitness,images:[media.fitness,media.exercise],age:'Adultes',material:'Acier thermolaqué',setting:'Extérieur'},
 {slug:'banc-horizon',name:'Banc Horizon',reference:'WU-1201',category:'Mobilier urbain',categorySlug:'mobilier-urbain',description:'Assise robuste pour parcs et circulations piétonnes.',technical:'Assise trois places · pose fixe',image:media.bench,images:[media.bench],age:'Tous publics',material:'Bois et acier',setting:'Extérieur'},
 {slug:'dalles-safeplay',name:'Dalles SafePlay',reference:'WS-2008',category:'Sols amortissants',categorySlug:'sols-amortissants',description:'Revêtement souple pour une aire de jeux sûre.',technical:'Dalles modulaires · entretien simple',image:media.floor,images:[media.floor],age:'Tous publics',material:'Caoutchouc',setting:'Extérieur'},
];
// Project examples shown for layout only; substitute verified client projects before publication.
export const projects=[
 {title:'Espaces scolaires',place:'Projet type',type:'Aires de jeux',description:'Des installations adaptées aux cours d’école.',image:media.hero},
 {title:'Parcs publics',place:'Projet type',type:'Fitness extérieur',description:'Le sport en plein air à la portée de tous.',image:media.fitness},
 {title:'Lieux d’accueil',place:'Projet type',type:'Mobilier et jeux',description:'Des espaces accueillants pour les familles.',image:media.park},
];

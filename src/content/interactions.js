import {CATALOG} from './furniture.js';
export const QUICK_ACTIONS={snack:{label:'Having a free snack',need:'hunger',rate:1.6,total:20},nap:{label:'Napping on the grass',need:'energy',rate:.7,total:90},chat:{label:'Calling a friend',need:'social',rate:1.8,total:40},stretch:{label:'Taking a breather',need:'fun',rate:1.1,total:30}};

const BASE_IDS={bed:'rest.sleep',sofa:'rest.unwind',fridge:'meal.prepare',stove:'meal.cook',toilet:'care.toilet',shower:'care.shower',tv:'leisure.watch',desk:'learning.practice',bookcase:'learning.read'};
export const INTERACTION_IDS=Object.freeze({...BASE_IDS,...Object.fromEntries(CATALOG.filter(d=>d.recipe).map(d=>[d.id,['piano','grand_piano','pool','hot_tub','fan'].includes(d.id)?'leisure.quiet':BASE_IDS[d.recipe]??(d.need?'leisure.quiet':undefined)]))});

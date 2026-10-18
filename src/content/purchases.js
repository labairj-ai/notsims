export const PURCHASE_TIERS=Object.freeze({entry:{label:'Starter',quality:1},comfortable:{label:'Comfortable',quality:1.15},premium:{label:'Premium',quality:1.3},ultra:{label:'Ultra',quality:1.4}});
export const priceTier=price=>price>=300000?'ultra':price>=15000?'premium':price>=800?'comfortable':'entry';
export function purchaseMetadata(d){const tier=d.tier??priceTier(d.price);return {tier,quality:PURCHASE_TIERS[tier].quality,prestige:tier==='ultra'?50:tier==='premium'?15:tier==='comfortable'?3:0,upkeep:0,tags:[],...d};}
export const resaleValue=d=>Math.floor(d.price*.6);

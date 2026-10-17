import {PROPERTY_TEMPLATES,ASSET_EXPERIENCES} from './asset-experiences.js';
import {purchaseMetadata} from './purchases.js';
const vehicle=(id,name,price,travelFactor,upkeep)=>({id,name,price,category:'Vehicles',kind:'vehicle',travelFactor,upkeep,tags:['transport','collection']});
const property=(id,name,price,upkeep)=>({id,name,price,category:'Properties',kind:'property',upkeep,tags:['residence','travel']});
const business=(id,name,price,grossIncome,operatingCost,upkeep=0)=>({id,name,price,category:'Businesses',kind:'business',grossIncome,operatingCost,upkeep,payoutInterval:1440,managementInterval:10080,managementDuration:120,tags:['income'],variancePolicy:'fixed'});
export const ASSETS=Object.freeze([
 vehicle('bicycle','Bicycle',550,.9,2),vehicle('used_car','Used car',8000,.7,35),vehicle('compact_car','Compact car',12000,.65,45),vehicle('luxury_car','Luxury car',85000,.6,120),vehicle('ev','High-end EV',110000,.55,100),vehicle('sports_car','Sports car',160000,.5,180),vehicle('supercar','Supercar',450000,.45,600),
 property('starter_home','Starter home',0,0),property('larger_home','Larger home',75000,150),property('cabin','Vacation cabin',220000,450),property('condo','City condo',350000,600),property('penthouse','Luxury penthouse',1200000,1500),property('estate','Private estate',2500000,3000),property('island','Island estate',25000000,20000),
 business('micro_business','Vending micro-business',5000,110,20),business('online_shop','Online shop',15000,350,100),business('cafe','Small café',75000,1700,700),business('duplex','Rental duplex',250000,4200,1200,450),business('commercial','Commercial building',1500000,24000,8000,1800),business('hotel','Boutique hotel',7500000,140000,65000,8000),
 {id:'yacht',name:'Yacht',price:5000000,kind:'experience',category:'Travel',upkeep:4000,tags:['travel','social'],destination:'yacht_trip'},
 {id:'jet',name:'Private jet',price:12000000,kind:'vehicle',category:'Vehicles',upkeep:12000,travelFactor:.2,tags:['transport','travel']},
 {id:'museum_art',name:'Museum-grade art',price:750000,kind:'collection',category:'Collections',upkeep:300,tags:['art','collection']}
].map(d=>purchaseMetadata({...d,...(d.kind==='property'?{template:PROPERTY_TEMPLATES[d.id]?.id}:{}),...(d.kind==='business'?{managementDuration:d.id==='micro_business'?45:d.id==='online_shop'?90:d.id==='hotel'?240:d.id==='commercial'?180:120,managementInterval:d.id==='micro_business'?7200:d.id==='hotel'?4320:10080}:{}),experienceIds:ASSET_EXPERIENCES[d.id]?.map(x=>x.id)??[]})));
export const assetDef=id=>ASSETS.find(a=>a.id===id);

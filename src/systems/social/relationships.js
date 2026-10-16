import {TIERS} from '../../content/social.js';
import {clamp} from './support.js';
export const pairKey=(a,b)=>[a,b].sort().join('|');
export function relationship(s,a,b,create=false){const key=pairKey(a,b);if(!s.relationships[key]&&create){const [x,y]=[a,b].sort();s.relationships[key]={a:x,b:y,familiarity:0,toward:{[x]:{affinity:0,trust:0,connection:0},[y]:{affinity:0,trust:0,connection:0}},lastContactMinute:0,contactCount:0,initiations:{[x]:0,[y]:0},peakTier:'Stranger',memories:[],cooldowns:{},recentInteractions:[]};}return s.relationships[key];}
export function relationshipStatus(r,minute=0){if(!r||r.familiarity===0)return 'Stranger';const a=r.toward[r.a],b=r.toward[r.b],affinity=Math.min(a.affinity,b.affinity),trust=Math.min(a.trust,b.trust);if(Math.abs(a.affinity-b.affinity)>45)return 'Complicated';
 if(affinity<=-65&&r.familiarity>=20&&trust<15&&r.memories.some(m=>m.valence<0&&m.intensity>=15&&minute-m.minute<4320))return 'Enemy';
 if(affinity<=-40)return 'Rival';if(affinity<=-20)return 'Disliked';if(affinity<0)return 'Uneasy';
 for(const [key,label] of [['best','Best Friend'],['close','Close Friend'],['friend','Friend']]){const t=TIERS[key];if(r.familiarity>=t.familiarity&&affinity>=t.affinity&&trust>=t.trust)return label;}
 return affinity>=12?'Friendly':'Acquaintance';}
export function bond(r){if(!r)return 0;return Math.round(clamp((r.familiarity+Math.min(...Object.values(r.toward).map(v=>v.affinity))+Math.min(...Object.values(r.toward).map(v=>v.trust))+Math.min(...Object.values(r.toward).map(v=>v.connection)))/4));}
export function dynamic(r){if(!r)return 'New face';const v=Object.values(r.toward);if(r.memories.slice(-6).some(m=>m.valence<0)&&v.some(d=>d.affinity>20))return 'Volatile';if(v.some(d=>d.affinity<0))return 'Tense';return Math.min(...v.map(d=>d.connection))<20?'Distant':'Warm';}

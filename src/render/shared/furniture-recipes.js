import {itemDef} from '../../content/furniture.js';
import {dimensions,furniturePoint} from '../../systems/objects/geometry.js';
// Painter contract: box, ellipse, line and p (world to painter coordinates).
export const furnitureRecipes={
furniture(f){const d=itemDef(f.type),[w,h]=dimensions(f),x=f.x,y=f.y,r=f.rotation%2;
 const b=(a,c,ww,hh,z,col,base=0)=>{const p=furniturePoint(f,a,c),q=furniturePoint(f,a+ww,c+hh);this.box(Math.min(p[0],q[0]),Math.min(p[1],q[1]),r?hh:ww,r?ww:hh,z,col,base);};
 const e=(a,c,z,rx,ry,col)=>{const [px,py]=furniturePoint(f,a,c);this.ellipse(px,py,z,rx,ry,col);};
 const color=d.color;
 if(!d.flat)this.ellipse(x+w/2+.08,y+h/2+.08,0,w*.75,h*.31,'#344c3120');
 switch(f.type){
 case 'bed':b(.06,.07,1.88,1.85,.24,'#a98060');b(.06,.03,1.88,.14,.85,'#ad8c6c');b(.13,.22,1.74,1.64,.25,'#f4eedf',.24);b(.13,.8,1.74,1.04,.1,color,.49);b(.18,.28,.7,.42,.12,'#faf7ea',.49);b(1.12,.28,.7,.42,.12,'#faf7ea',.49);b(.13,.8,1.74,.2,.04,'#e9bd96',.59);break;
 case 'sofa':b(.05,.08,1.9,.8,.22,'#697f70');b(.07,.06,1.86,.2,.8,color);b(.05,.12,.2,.75,.62,color);b(1.75,.12,.2,.75,.62,color);b(.29,.34,.68,.5,.2,'#a5b9a7',.24);b(1.02,.34,.68,.5,.2,'#a5b9a7',.24);b(.32,.14,.56,.17,.32,'#a5b9a7',.4);b(1.09,.14,.56,.17,.32,'#a5b9a7',.4);break;
 case 'fridge':b(.12,.14,.78,.72,1.5,color);b(.16,.87,.69,.025,.7,'#d0d9c5',.07);b(.16,.87,.69,.025,.55,'#d0d9c5',.84);b(.23,.9,.05,.04,.27,'#768779',.48);b(.23,.9,.05,.04,.24,'#768779',1.01);break;
 case 'stove':b(.09,.12,.82,.8,.73,color);b(.09,.12,.82,.8,.06,'#626e65',.73);b(.2,.93,.61,.03,.4,'#465c52',.15);for(const a of [.3,.69])for(const c of [.32,.68])e(a,c,.8,.15,.07,'#293e37');break;
 case 'toilet':b(.2,.08,.6,.28,.85,color);b(.3,.35,.4,.4,.25,'#d1d7cd');e(.5,.62,.34,.44,.24,color);e(.5,.62,.35,.25,.13,'#829e9b');b(.39,.12,.2,.13,.03,'#a5b4a6',.86);break;
 case 'shower':b(.05,.05,.9,.9,.12,'#e5e9dc');b(.08,.07,.84,.08,1.7,'#8caba8');b(.08,.07,.07,.85,1.7,'#adcac15c');b(.85,.07,.06,.85,1.7,'#b7d4ce7a');b(.25,.1,.07,.05,1.34,'#e4e5d6');b(.25,.1,.35,.1,.05,'#e4e5d6',1.34);for(let i=0;i<3;i++)this.line(this.p(x+.42+i*.1,y+.4,1.2),this.p(x+.42+i*.1,y+.4,.35),'#deeeee70',1);break;
 case 'tv':b(.3,.28,1.4,.48,.4,'#a08266');b(.89,.44,.2,.14,.24,'#45554b',.4);b(.09,.34,1.82,.12,1.04,'#36493f',.61);b(.17,.475,1.66,.015,.83,'#678780',.71);b(.22,.48,1.5,.015,.12,'#8ea79b',1.33);break;
 case 'table':case 'desk':for(const a of [.12,1.73])for(const c of [.12,.78])b(a,c,.12,.12,.67,'#927455');b(.04,.04,1.92,.91,.12,color,.67);if(f.type==='desk'){b(.62,.18,.75,.13,.45,'#496157',.8);b(.63,.22,.72,.02,.35,'#a6c2b0',.87);b(.62,.38,.75,.3,.04,'#ced4c2',.81);}break;
 case 'chair':for(const a of [.18,.73])for(const c of [.18,.73])b(a,c,.1,.1,.38,'#967451');b(.12,.1,.76,.13,.9,color);b(.12,.15,.76,.69,.1,color,.39);break;
 case 'plant':e(.5,.5,.05,.29,.14,'#a5765b');b(.28,.28,.44,.44,.37,'#b88d6a');this.line(this.p(x+.5,y+.5,.3),this.p(x+.5,y+.5,1.3),'#5d7e4f',2);for(const [a,c,z] of [[.23,.43,.9],[.7,.5,1.06],[.37,.7,1.2],[.55,.27,1.35]])e(a,c,z,.27,.12,((a+c)*10)%2?'#69894f':'#7f9a64');break;
 case 'rug':b(.02,.02,1.96,1.96,.015,color);b(.13,.13,1.74,1.74,.005,'#e3b39a',.016);b(.21,.21,1.58,1.58,.005,color,.022);for(let i=0;i<6;i++)this.line(this.p(x+.1+i*.34,y+1.94,.03),this.p(x+.1+i*.34,y+2.06,.03),'#e4c1a5',1);break;
 case 'lamp':e(.5,.5,.02,.3,.14,'#b7a885');b(.47,.47,.06,.06,1.2,'#a1906b');e(.5,.5,1.15,.46,.19,'#ebd9ac');e(.5,.5,1.35,.36,.25,'#f5e8c7');e(.5,.5,1.48,.22,.12,'#f5e8c7');break;
 case 'bookcase':b(.1,.12,.8,.7,1.45,color);b(.15,.83,.7,.03,1.3,'#8c7455',.08);for(let z=.13;z<1.4;z+=.43){for(let i=0;i<4;i++)b(.2+i*.145,.79,.105,.11,.29,['#b6c19b','#d6b180','#859b91','#db9873'][i],z);b(.12,.13,.76,.76,.045,color,z+.33);}break;
 }
 },
tree(x,y,size=1){this.ellipse(x+.3,y+.2,0,.8*size,.35*size,'#456d3420');this.box(x-.1,y-.1,.2,.2,1.9*size,'#9a8c64');for(const [a,b,z,rx,ry,col] of [[0,0,2.1,.9,.65,'#93ab78'],[-.4,.1,1.8,.75,.52,'#a5ba84'],[.4,.1,2,.7,.55,'#829d6b'],[0,-.1,2.55,.68,.5,'#b0c18b']])this.ellipse(x+a*size,y+b*size,z*size,rx*size,ry*size,col);}
};

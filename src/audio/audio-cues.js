// IDs are independent of filenames. Asset IDs resolve through the local library.
const cue=(id,sources,{bus='sfx',mode='oneShot',gain=.5,cooldown=.12,maxPolyphony=2,pitchJitter=.025,spatial=true,preloadGroup='world'}={})=>({id,sources,bus,mode,gain,cooldown,maxPolyphony,pitchJitter,spatial,preloadGroup});
export const AUDIO_CUES=[
 cue('ui.select',['select'],{bus:'ui',gain:.25,spatial:false,preloadGroup:'essential'}),
 cue('ui.confirm',['confirm'],{bus:'ui',gain:.3,spatial:false,preloadGroup:'essential'}),
 cue('ui.cancel',['cancel'],{bus:'ui',gain:.3,spatial:false,preloadGroup:'essential'}),
 cue('ui.error',['error'],{bus:'ui',gain:.28,cooldown:.5,maxPolyphony:1,spatial:false,preloadGroup:'essential'}),
 cue('ui.rotate',['rotate'],{bus:'ui',gain:.3,spatial:false,preloadGroup:'essential'}),
 ...['floor','wall','door'].map(id=>cue(`build.${id}.place`,[id==='door'?'door-place':id],{cooldown:.12,gain:.5})),
 cue('object.place',['place']),cue('object.sell',['sell'],{gain:.35}),
 cue('economy.purchase',['purchase'],{gain:.25,spatial:false}),cue('economy.bill',['bill'],{gain:.3,spatial:false,cooldown:1}),
 cue('career.shift.complete',['payday'],{gain:.4,spatial:false,cooldown:1}),cue('career.promotion',['promotion'],{gain:.4,spatial:false,cooldown:1}),
 cue('movement.footstep.indoor',['step-indoor-1','step-indoor-2'],{gain:.45,cooldown:.38,maxPolyphony:1}),
 cue('movement.footstep.outdoor',['step-outdoor-1','step-outdoor-2'],{gain:.35,cooldown:.38,maxPolyphony:1}),
 ...[['bed.rustle','fabric'],['sofa.rustle','fabric'],['fridge.open','fridge'],['fridge.close','fridge'],['eat','eat'],['toilet.flush','flush'],['book.page','page'],['lamp.switch','switch'],['shower.start','water-start'],['shower.stop','water-stop'],['stove.start','ignite']].map(([id,source])=>cue(`interaction.${id}`,[source],{gain:.4,cooldown:.25})),
 ...[['shower','shower'],['stove','stove'],['tv','tv'],['desk','typing']].map(([id,source])=>cue(`interaction.${id}.loop`,[source],{mode:'loop',gain:.3,maxPolyphony:1,pitchJitter:0,cooldown:0})),
 cue('ambience.garden.loop',['garden-breeze'],{bus:'ambience',mode:'loop',gain:.16,maxPolyphony:1,cooldown:0,pitchJitter:0,spatial:false}),
 cue('music.menu',['little-morning'],{bus:'music',mode:'stream',gain:.75,spatial:false,pitchJitter:0,preloadGroup:'music'}),
 cue('music.home.day',['little-morning','clover-walk'],{bus:'music',mode:'stream',gain:.75,spatial:false,pitchJitter:0,preloadGroup:'music'}),
 cue('music.home.evening',['porch-light'],{bus:'music',mode:'stream',gain:.75,spatial:false,pitchJitter:0,preloadGroup:'music'}),
];
export const CUES=Object.fromEntries(AUDIO_CUES.map(c=>[c.id,c]));
export const INTERACTION_AUDIO={
 'rest.sleep':{start:'interaction.bed.rustle'},'rest.unwind':{start:'interaction.sofa.rustle'},
 'meal.prepare':{start:'interaction.fridge.open',complete:'interaction.fridge.close',detail:'interaction.eat'},
 'meal.cook':{start:'interaction.stove.start',loop:'interaction.stove.loop',complete:'interaction.eat'},
 'care.toilet':{complete:'interaction.toilet.flush'},
 'care.shower':{start:'interaction.shower.start',loop:'interaction.shower.loop',complete:'interaction.shower.stop'},
 'leisure.watch':{loop:'interaction.tv.loop'},'learning.practice':{loop:'interaction.desk.loop'},'learning.read':{start:'interaction.book.page'},
 // Decorative furniture has no simulation interaction. Avoid inventing gameplay.
 chair:{decision:'No active interaction; placement/sale feedback only.'},lamp:{decision:'Decorative today; switch cue reserved.'},table:{decision:'Decorative today; placement/sale feedback only.'},plant:{decision:'Decorative today; placement/sale feedback only.'},rug:{decision:'Floor decoration; placement/sale feedback only.'},
};

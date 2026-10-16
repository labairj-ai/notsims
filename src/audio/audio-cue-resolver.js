// Only semantic facts enter the resolver; no playback or simulation mutations.
export function resolveAudioCues(event){
 if(!event||typeof event.type!=='string')return [];
 if(event.type==='SOCIAL_NOTIFICATION'&&event.notificationType==='text')return ['social.phone.text'];
 if(event.type==='SOCIAL_EVENT_OFFERED'&&event.eventKind==='phone_call')return ['social.phone.ring'];
 if(event.type==='SOCIAL_NOTIFICATION'&&event.notificationType==='phone_call')return ['social.phone.ring'];
 if(event.type==='VISIT_ARRIVED'||event.type==='SOCIAL_EVENT_OFFERED'&&event.eventKind==='drop_by')return ['social.door.knock'];
 if(event.type==='RELATIONSHIP_STATUS_CHANGED'&&['Friend','Close Friend','Best Friend'].includes(event.after))return ['social.relationship.milestone'];
 const simple={UI_SELECT:'ui.select',UI_CONFIRM:'ui.confirm',UI_CANCEL:'ui.cancel',UI_ERROR:'ui.error',UI_ROTATE:'ui.rotate',FURNITURE_PLACED:'object.place',FURNITURE_SOLD:'object.sell',ROOM_BUILT:'build.wall.place',BILL_CHARGED:'economy.bill',ACTION_CANCELLED:'ui.cancel',ACTION_REJECTED:'ui.error',APPEARANCE_CHANGED:'ui.confirm'};
 if(simple[event.type])return [simple[event.type]];
 if(event.type==='FOOTSTEP')return [`movement.footstep.${event.surface==='indoor'?'indoor':'outdoor'}`];
 if(event.type==='TILE_EDITED')return ['build.floor.place'];
 if(event.type==='EDGE_EDITED')return [`build.${event.tool==='door'?'door':'wall'}.place`];
 if(event.type==='SHIFT_COMPLETED')return [event.shifts>0&&event.shifts%3===0?'career.promotion':'career.shift.complete'];
 if(event.type==='MONEY_SPENT'&&event.reason==='meal')return ['economy.purchase'];
 return [];
}

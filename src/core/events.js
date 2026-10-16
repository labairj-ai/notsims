// Events are returned facts, never persisted authority or an asynchronous bus.
export function emit(events,type,payload={}){events?.push({...payload,type});}

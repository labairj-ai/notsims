// Presentation-only signals. These never enter command/replay or saved state.
export const AUDIO_BUSES=Object.freeze(['master','music','sfx','ambience','ui']);
export const PRESENTATION_EVENTS=Object.freeze(['UI_SELECT','UI_CONFIRM','UI_CANCEL','UI_ERROR','UI_ROTATE','FOOTSTEP']);
export {INTERACTION_IDS} from '../content/interactions.js';

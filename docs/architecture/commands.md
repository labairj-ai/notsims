# Commands and returned events

`dispatch(state, command)` is synchronous. It returns `{ok, code, events}` and
optional `details` on failure. Commands are serializable plain data. Rejected
commands return an empty event list and leave state unchanged. The dispatcher
validates command shape; owning systems validate and apply domain rules. Legacy
engine facade functions retain their old API for compatibility.

| Command | Fields |
| --- | --- |
| MOVE_TO | x, y |
| INTERACT | id (furniture ID), optional interaction (`use` today) |
| QUICK_ACTION | kind: snack, nap, chat, stretch |
| CANCEL_ACTION | None |
| BUILD_ROOM | x1, y1, x2, y2, optional floor |
| EDIT_TILE | tool: floor/wall/door/erase; x, y, edge; optional floor |
| ERASE | x, y, edge |
| PLACE_OBJECT | object (catalog ID), x, y, optional rotation |
| CHANGE_JOB | job (career ID) |
| START_SHIFT | None |
| CHANGE_APPEARANCE | appearance: subset of name/skin/hair/shirt/style/trait |

The UI application owns `app.dispatch` and `app.send`, and routes all of these
mutations through dispatch. New game creation and validated save replacement
remain session lifecycle operations. `dispatchCommand` can be injected at startup
for controller testing; state always remains in the simulation.

MOVE_TO/INTERACT/START_SHIFT queue intent. Successful enqueue is not a promise of
later execution: path, meal affordability and energy are checked when the action
begins, as before. `advance(state, gameMinutes)` returns lifecycle/economy events;
ACTION_REJECTED reports UNREACHABLE, INVALID_TARGET, INSUFFICIENT_FUNDS,
INVALID_CAREER or LOW_ENERGY as applicable. A changed path emits ACTION_CANCELLED
with PATH_CHANGED. Player cancellation uses PLAYER.

Events are ordered facts in returned arrays: ACTION_QUEUED/STARTED/COMPLETED/
CANCELLED/REJECTED, MONEY_SPENT/RECEIVED, ROOM_BUILT, TILE/EDGE_EDITED/REMOVED,
FURNITURE_PLACED/SOLD, JOB_CHANGED, SHIFT_COMPLETED, BILL_CHARGED,
SKILL_GAINED and APPEARANCE_CHANGED. Money events include absolute amount,
reason and resulting balance. Object events use `object` for catalog IDs and
`id` for instance IDs, leaving `type` reserved for the event discriminator.

Events are optional output parameters through systems, never an event bus or
persisted event ledger. No subscriber mutates state in response to an event.
Failure codes are stable routing values; ui/command-feedback.js owns generic
copy, while legacy system messages remain optional details to preserve exact
existing validation feedback.

# Deterministic scenarios and replay

Run `npm test`: CI includes tests/scenarios/*.test.js by default. The harness in
tests/helpers/scenario.js starts from newGame or a validated save/fixture and
executes serializable commands and explicit advancement steps. Each step can
assert a result code, ordered event types and meaningful state invariants.
Failures identify the scenario name, one-based step, command/time operation and
underlying assertion difference.

A version 1 trace is `{version:1,name,seed,initial,steps}`. Each step contains
`command` or `advance` plus `chunk`, and its returned `result`. `initial` is the
starting canonical state. Traces contain no assertion functions, browser state,
wall-clock timestamps or locale-formatted strings. JSON round trips are supported.
`replay(trace)` re-executes commands and checks returned results/events step by
step. Tests also compare the final state and selected gameplay invariants.
Replay history is never added to production saves.

Advancement uses game minutes. Production tick retains its legacy 1440-minute
per-call cap; the harness divides longer durations into calls <= 1440. Minute
chunks and larger chunks produce identical state and ordered events for integer
game-time scenarios. Existing fractional-frame movement tests remain in place;
no claim of bit-identical floating-point accumulation for arbitrary fractional
partitions is added.

core/rng.js provides an explicit Mulberry32 stream: createRng(uint32Seed), next()
in [0,1), and a uint32 state getter. Recreate from state to resume the stream.
The harness creates and exposes the stream to checks/future injected systems.
There is no random simulation behavior today. Any future autonomy/random-event
system must receive a stream explicitly and define save ownership/migration for
its state before relying on randomness. Math.random and wall clocks must not
enter simulation decisions.

Scenarios cover morning meal/shower/chat, skill furniture and rest, a resumed
legacy shift and early cancellation, home construction/furnishing/sales, and
six-day bills. Repeated seeds/commands and JSON replay are checked, as is minute
versus chunked advancement. Unit tests separately cover RNG restoration and
failure diagnostics.

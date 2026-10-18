# 0089 — Add Coworker Experiences and Work Events

- **ID:** 0089
- **Status:** completed
- **Created:** 2026-10-17
- **Priority:** high
- **Depends:** 0035, 0086–0088
- **Source:** https://chatgpt.com/s/t_6ad2d6897db48191b50e32ec0f700145

## Goal

Make Work contribute to the character's story rather than being only a timer.

## Event classes

Start small:

```text
Informational
Choice
Social
Performance
```

Examples:

### Informational

```text
A quiet morning at work.
```

### Coworker social

```text
Sam asks if you want to grab lunch together.
```

### Choice

```text
A deadline is slipping.

Stay late and help
Focus on your own work
Ask Sam for help
```

### Positive event

```text
Your manager loved your idea.
```

## Frequency

Bound events heavily.

Initial target:

```text
0–1 meaningful events per shift
```

Avoid turning 20 seconds of compressed Work into notification spam.

## Attention policy

Informational:

```text
compression continues
```

Choice:

```text
attentionRequired = true
```

Auto 24× drops to normal selected speed until resolved.

## Coworker integration

Use the existing relationship engine.

Possible outcomes:

- Familiarity;
- Affinity;
- Trust;
- Connection;
- Memories.

Do not create a second coworker relationship system.

## Determinism

Use existing deterministic RNG infrastructure.

No `Math.random()`.

## Done when

- [x] bounded event scheduler exists.
- [x] informational events do not interrupt.
- [x] choices suspend compression.
- [x] social outcomes use relationship engine.
- [x] events influence Career Performance where appropriate.
- [x] exact replay remains deterministic.

## Implementation evidence

See [career/wealth validation](../docs/reviews/economy-progression-validation.md) and `tests/wealth-career.test.js`. Implementation and automated coverage are present; shared human/physical acceptance gates remain separate.

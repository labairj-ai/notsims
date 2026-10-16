# Notsims embodied character behavior

Tasks 0054–0069 now have software implementation and automated coverage.
See the [behavior contract](docs/architecture/embodied-character-behavior.md)
and [validation record](docs/reviews/embodied-character-behavior-validation.md).

The shared renderer-neutral resolver supplies both Classic and 3D. The pinned
CC0 exporter produces 26 clips; the controller owns additive gestures, affect,
gaze, contact and safe cleanup. Shared-food costs are charged once on arrival.

Physical iPhone/Android, standalone, audible-output and human motion review
remain pending under 0052/0068 and the individual task acceptance requirements.
Implementation availability does not certify those results.

## PR acceptance and release follow-ups

The next [open items 0070–0076](.todos/README.md#embodied-pr-acceptance-and-release-follow-ups)
reconcile evidence/status, remove duplicate eligibility work, clarify behavior-off
terminology, protect main, conduct desktop/physical human reviews and release the
accepted candidate. These are separate from the implemented PR's software work;
adding the tasks does not close human acceptance or authorize a merge by itself.

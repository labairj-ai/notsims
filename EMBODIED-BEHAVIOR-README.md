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

# Architecture implementation order

Tasks 0001–0012 are complete. Their numeric order satisfies all prerequisites.
See the [project README](../README.md#architecture-work-order) for the ordered
list and [validation record](../docs/reviews/architecture-refactor-validation.md).

Tasks 0004, 0005 and 0009 are independently ready after 0003. Task 0008 follows
0004–0007; 0010 follows 0008 and 0009; 0011 follows 0010; 0012 follows 0008 and
0011. Original task descriptions and source SHA are retained in each file.

## Audio expansion

Tasks 0013–0020 are complete. Order: 0013, 0014/0015, 0016/0017, 0018/0019,
then 0020. Numeric order satisfies all dependencies. See the
[audio acceptance record](../docs/reviews/audio-validation.md).

## Production audio certification

0021 is deployed and passes automated production checks. It remains in progress
pending the required human listening result. See the
[production acceptance record](../docs/reviews/audio-production-validation.md).

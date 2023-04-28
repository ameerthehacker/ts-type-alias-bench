# Simple type alias bench

To check whether simple type unions need to be type aliased and if so does it give a perf boost

Creates two projects

1. no-alias-project

creates 500 files each with 100 variable declaration using `let variable: string | number = "test"`;

2. with-alias-project

creates 500 files each with 100 variable declaration using `let variable: StringOrNumber = "test"`;

runs tsc on both of them for 10 times and averages the result

```
Avg of 10
No type alias: 1.57s
With type alias: 1.55s
```

There is no significant type check slowdown so simple type unions can be inlined

To run the benchmark just execute (needs node v18)

``
node ./bench.mjs
``

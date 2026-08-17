# rungraph-demo

A tiny token-caching service with a test that fails on `main` — on purpose.

This repo is the staging ground for the run you can explore on the
[rungraph](https://github.com/fayzan123/rungraph) landing page: a real Claude
Code session was recorded here, graph and all, fighting this repo's actual
trap. Nothing about the run is synthetic — clone this repo, run `npm test`,
and you'll hit exactly what the agent hit.

```
npm test        # the suite (pretest regenerates src/token.js)
npm run watch   # keep the generated store in sync while developing
```

One test fails: `refreshes the access token once under concurrent calls`.
The fix the recorded agent landed was never pushed (you'll see why in the
run), so `main` still fails — that's the point.

MIT.

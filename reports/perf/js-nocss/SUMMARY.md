# Performance campaign

Primary metrics follow the stated Lighthouse throttling protocol. Observed trace timings are a separate diagnostic table, never substituted for simulated scores. The main table includes all transferred resources collected during the unscrolled audit. The strict initial-load table sums only requests with networkRequestTime <= observedLoad from the same trace; later requests are separated. This cutoff is observed for both protocols, not a simulated timestamp. Values are medians of each metric, not one selected run.

## simulate

| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| home-mobile | 3/3 | 77 | 1.16 | 3.89 | 3.43 | 412 | 0.000 | 34.5 | 16.8 | 172.5 | 706 |

Observed trace timings (same reports, diagnostic only):

| Scenario | Observed FCP s | Observed LCP s | Observed SI s |
|---|---|---|---|
| home-mobile | 2.07 | 2.07 | 2.07 |

Strict initial navigation transfers, excluding requests started after the observed load event:

| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |
|---|---|---|---|---|---|---|---|---|---|
| home-mobile | 0.53 | 34.5 | 16.8 | 168.9 | 366.0 | 0.0 | 0.0 | 3.6 | 49.8 |

CPU benchmark ranges (environment variability, not a site metric):

- home-mobile: 509–1120; high variability — avoid attributing a small score change to code alone.


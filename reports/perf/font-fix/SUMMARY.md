# Performance campaign

Primary metrics follow the stated Lighthouse throttling protocol. Observed trace timings are a separate diagnostic table, never substituted for simulated scores. The main table includes all transferred resources collected during the unscrolled audit. The strict initial-load table sums only requests with networkRequestTime <= observedLoad from the same trace; later requests are separated. This cutoff is observed for both protocols, not a simulated timestamp. Values are medians of each metric, not one selected run.

## devtools

| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile (INCOMPLETE) | 1/1 | 77 | 2.92 | 3.02 | 5.10 | 378 | 0.010 | 37.6 | 17.3 | 175.1 | 1380 |
| home-desktop | 3/3 | 80 | 1.92 | 1.92 | 2.20 | 0 | 0.000 | 36.3 | 17.3 | 201.7 | 695 |
| home-mobile | 3/3 | 79 | 3.15 | 3.25 | 4.72 | 272 | 0.002 | 36.3 | 17.3 | 175.1 | 1399 |

Observed trace timings (same reports, diagnostic only):

| Scenario | Observed FCP s | Observed LCP s | Observed SI s |
|---|---|---|---|
| ar-home-mobile | 2.92 | 3.02 | 5.10 |
| home-desktop | 1.92 | 1.92 | 2.20 |
| home-mobile | 3.15 | 3.25 | 4.72 |

Strict initial navigation transfers, excluding requests started after the observed load event:

| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |
|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 4.23 | 37.6 | 17.3 | 168.2 | 432.3 | 0.0 | 0.0 | 6.9 | 179.8 |
| home-desktop | 0.75 | 36.3 | 17.3 | 168.2 | 369.2 | 0.0 | 0.0 | 33.5 | 176.1 |
| home-mobile | 3.80 | 36.3 | 17.3 | 168.2 | 389.4 | 0.0 | 0.0 | 6.9 | 159.2 |

CPU benchmark ranges (environment variability, not a site metric):

- ar-home-mobile: 1380–1380.
- home-desktop: 684–1655; high variability — avoid attributing a small score change to code alone.
- home-mobile: 1061–1419.

## simulate

| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 3/3 | 78 | 1.53 | 4.23 | 5.02 | 216 | 0.000 | 37.6 | 17.3 | 175.1 | 1632 |
| en-fleet-mobile | 3/3 | 72 | 1.35 | 6.83 | 4.27 | 188 | 0.000 | 21.0 | 17.3 | 184.3 | 1475 |
| home-desktop | 3/3 | 99 | 0.35 | 0.81 | 0.87 | 7 | 0.000 | 36.3 | 17.3 | 201.7 | 1626 |
| home-mobile | 3/3 | 82 | 1.52 | 3.97 | 4.83 | 165 | 0.000 | 36.3 | 17.3 | 175.1 | 1415 |

Observed trace timings (same reports, diagnostic only):

| Scenario | Observed FCP s | Observed LCP s | Observed SI s |
|---|---|---|---|
| ar-home-mobile | 2.88 | 2.88 | 3.00 |
| en-fleet-mobile | 2.57 | 2.57 | 2.57 |
| home-desktop | 1.21 | 1.21 | 1.21 |
| home-mobile | 2.95 | 2.95 | 2.94 |

Strict initial navigation transfers, excluding requests started after the observed load event:

| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |
|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 0.36 | 37.6 | 17.3 | 168.2 | 432.3 | 0.0 | 0.0 | 6.9 | 118.0 |
| en-fleet-mobile | 0.25 | 21.0 | 17.3 | 166.1 | 369.4 | 0.0 | 0.0 | 18.2 | 761.1 |
| home-desktop | 0.35 | 36.3 | 17.3 | 168.2 | 369.2 | 0.0 | 0.0 | 33.5 | 96.7 |
| home-mobile | 0.29 | 36.3 | 17.3 | 168.2 | 389.4 | 0.0 | 0.0 | 6.9 | 117.1 |

CPU benchmark ranges (environment variability, not a site metric):

- ar-home-mobile: 1345–1672.
- en-fleet-mobile: 871–1617; high variability — avoid attributing a small score change to code alone.
- home-desktop: 1362–1698.
- home-mobile: 1369–1477.


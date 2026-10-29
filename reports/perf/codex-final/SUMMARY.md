# Performance campaign

Primary metrics follow the stated Lighthouse throttling protocol. Observed trace timings are a separate diagnostic table, never substituted for simulated scores. The main table includes all transferred resources collected during the unscrolled audit. The strict initial-load table sums only requests with networkRequestTime <= observedLoad from the same trace; later requests are separated. This cutoff is observed for both protocols, not a simulated timestamp. Values are medians of each metric, not one selected run.

## devtools

| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 3/3 | 73 | 3.59 | 3.85 | 4.45 | 271 | 0.005 | 37.5 | 17.3 | 175.1 | 666 |
| en-fleet-mobile | 3/3 | 88 | 2.61 | 2.71 | 2.68 | 279 | 0.021 | 21.0 | 17.3 | 184.3 | 873 |
| home-desktop | 3/3 | 80 | 1.91 | 1.91 | 2.21 | 0 | 0.003 | 36.8 | 17.3 | 201.7 | 809 |
| home-mobile | 3/3 | 82 | 3.02 | 3.10 | 3.88 | 268 | 0.004 | 36.8 | 17.3 | 175.1 | 876 |

Observed trace timings (same reports, diagnostic only):

| Scenario | Observed FCP s | Observed LCP s | Observed SI s |
|---|---|---|---|
| ar-home-mobile | 3.59 | 3.85 | 4.45 |
| en-fleet-mobile | 2.61 | 2.71 | 2.68 |
| home-desktop | 1.91 | 1.91 | 2.21 |
| home-mobile | 3.02 | 3.10 | 3.88 |

Strict initial navigation transfers, excluding requests started after the observed load event:

| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |
|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 4.14 | 37.5 | 17.3 | 168.2 | 368.9 | 0.0 | 0.0 | 6.9 | 179.8 |
| en-fleet-mobile | 7.15 | 21.0 | 17.3 | 166.7 | 915.7 | 0.0 | 0.0 | 17.6 | 147.0 |
| home-desktop | 0.99 | 36.8 | 17.3 | 168.2 | 348.0 | 0.0 | 0.0 | 33.5 | 176.0 |
| home-mobile | 3.73 | 36.8 | 17.3 | 168.2 | 368.1 | 0.0 | 0.0 | 6.9 | 178.9 |

CPU benchmark ranges (environment variability, not a site metric):

- ar-home-mobile: 590–1067; high variability — avoid attributing a small score change to code alone.
- en-fleet-mobile: 801–970.
- home-desktop: 701–1387; high variability — avoid attributing a small score change to code alone.
- home-mobile: 715–1496; high variability — avoid attributing a small score change to code alone.

## simulate

| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 3/3 | 71 | 1.29 | 3.97 | 4.60 | 523 | 0.000 | 37.5 | 17.3 | 175.1 | 933 |
| en-fleet-mobile | 3/3 | 68 | 1.10 | 5.69 | 2.62 | 458 | 0.000 | 21.0 | 17.3 | 184.3 | 754 |
| home-desktop | 3/3 | 99 | 0.31 | 0.77 | 1.09 | 12 | 0.000 | 36.8 | 17.3 | 201.7 | 1315 |
| home-mobile | 3/3 | 81 | 1.42 | 3.99 | 4.75 | 235 | 0.000 | 36.8 | 17.3 | 175.1 | 1371 |

Observed trace timings (same reports, diagnostic only):

| Scenario | Observed FCP s | Observed LCP s | Observed SI s |
|---|---|---|---|
| ar-home-mobile | 2.83 | 2.83 | 2.83 |
| en-fleet-mobile | 1.16 | 1.16 | 1.17 |
| home-desktop | 1.49 | 1.49 | 1.48 |
| home-mobile | 2.85 | 2.85 | 2.83 |

Strict initial navigation transfers, excluding requests started after the observed load event:

| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |
|---|---|---|---|---|---|---|---|---|---|
| ar-home-mobile | 0.45 | 37.5 | 17.3 | 168.2 | 368.9 | 0.0 | 0.0 | 6.9 | 118.0 |
| en-fleet-mobile | 0.61 | 21.0 | 17.3 | 166.1 | 844.5 | 0.0 | 0.0 | 18.2 | 285.9 |
| home-desktop | 0.36 | 36.8 | 17.3 | 168.2 | 348.0 | 0.0 | 0.0 | 33.5 | 96.7 |
| home-mobile | 0.31 | 36.8 | 17.3 | 168.2 | 368.1 | 0.0 | 0.0 | 6.9 | 117.1 |

CPU benchmark ranges (environment variability, not a site metric):

- ar-home-mobile: 752–1005.
- en-fleet-mobile: 645–1013; high variability — avoid attributing a small score change to code alone.
- home-desktop: 954–1611; high variability — avoid attributing a small score change to code alone.
- home-mobile: 1337–1559.


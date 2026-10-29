# Mesures de performance — AB FAST CAR

## Reprise Codex — 29 octobre 2026

Les dossiers `final/` et les tableaux « résultat final » plus bas sont des
**mesures historiques du travail précédent**, pas le résultat du code livré
après intégration des vidéos et des conditions. La nouvelle campagne sera
documentée séparément dans `codex-final/` après l'unique build partagé.

### Comparaison historique relue avant le choix CSS

Accueil mobile, médiane de trois rapports JSON par dossier :

| Variante | Protocole | Perf | FCP s | LCP s | SI s | TBT ms | CLS |
|---|---|---|---|---|---|---|---|
| baseline2 | simulation Lighthouse | 70 | 1,40 | 3,86 | 2,68 | 651 | 0,004 |
| js-inline | simulation Lighthouse | 71 | 1,41 | 4,22 | 5,11 | 419 | 0 |
| js-nocss | simulation Lighthouse | 77 | 1,16 | 3,89 | 3,43 | 412 | 0 |
| baseline2-devtools | throttling DevTools | 84 | 2,20 | 2,47 | 3,08 | 381 | 0,004 |
| js-inline-devtools | throttling DevTools | 83 | 2,00 | 2,42 | 3,01 | 362 | 0,004 |
| js-nocss-devtools | throttling DevTools | 88 | 2,75 | 2,89 | 3,55 | 145 | 0,004 |

Le JS est passé de 189 531 à 176 625 octets transférés entre baseline2 et
js-inline. Avec le même poids JS, le CSS externe remplace 83 490 octets HTML
par 35 344 octets HTML et 17 181 octets CSS : **30 965 octets en moins** au
total, et une feuille hachée réutilisable depuis le cache. `inlineCss` est donc
désactivé par défaut ; `NEXT_INLINE_CSS=1` conserve la comparaison possible.
Ce choix ne prouve pas un gain LCP dans tous les protocoles : les médianes
DevTools LCP et SI se dégradent, et le benchmark CPU varie beaucoup entre les
runs. Les objectifs ne sont pas encore validés sur l'intégration finale.

### Campagne reproductible

Les outils sont désormais dans le dépôt : `scripts/perf/run.mjs` et
`scripts/perf/summary.mjs`. Ils réutilisent Lighthouse et Chrome déjà installés,
sans réinstaller les dépendances. Sur ce poste, Lighthouse 12.6.1 est dans
`C:\Users\HP\lhtool\node_modules\lighthouse\cli\index.js`.

Après arrêt du serveur de développement et de tous les tests navigateur,
le coordinateur construit une seule fois puis lance `pnpm start --port 3100`.
Ne pas compiler, modifier les sources ou lancer d'autres navigateurs de test
pendant la campagne :

```powershell
node scripts/perf/run.mjs --base=http://localhost:3100 --dist=.next --out=reports/perf/codex-final
```

Le runner vérifie la présence d'un `BUILD_ID` et sa stabilité avec les manifestes
du build avant chaque mesure. Il refuse de fusionner une campagne avec un
répertoire de sortie existant. Les scénarios `/` mobile, `/` desktop, `/ar`
mobile et `/en/fleet` mobile ont chacun trois exécutions séquentielles, d'abord
dans `simulate/`, puis dans `devtools/`. Chaque run utilise un Chrome neuf,
les réglages Lighthouse par défaut du profil et la remise à zéro du stockage.
Aucun drapeau contournant l'autoplay n'est ajouté.

Les fichiers JSON et HTML de chaque run sont conservés. `campaign.json`
enregistre le build et les conditions ; `summary.json` garde les valeurs par
run, le benchmark et les médianes. `SUMMARY.md` distingue les métriques du
protocole des timings observés dans la trace. Les octets HTML/CSS/JS sont les
transferts de l'audit de navigation sans défilement (avec les éventuels
préchargements automatiques), pas la somme des tailles brutes des fichiers.
Un groupe de moins de trois runs valides est signalé incomplet.

Pour refaire seulement le résumé de rapports existants :

```powershell
node scripts/perf/summary.mjs reports/perf/codex-final
```

Contrôle de ressources initial : environ 2,83 Gio libres sur C: ; aucun ancien
rapport ou média n'a été supprimé. L'inventaire des commandes des processus via
CIM était refusé dans le bac à sable ; le coordinateur suit les processus des
serveurs lancés pour garantir l'absence de compilation concurrente.

Toutes les mesures « avant / après » sont faites sur des **builds de production**
(`next build` + `next start`), jamais sur le serveur de dev.

## Conditions

| | |
|---|---|
| Outil | Lighthouse 12.6.1 (CLI, `--only-categories=performance,accessibility,best-practices,seo`) |
| Navigateur | Chrome 156 headless (`--headless=new`), Windows 10, machine locale |
| Mobile | réglage par défaut : écran 412×823 @1.75, throttling **simulé** (RTT 150 ms, 1,6 Mbit/s, CPU ×4) |
| Desktop | `--preset=desktop` : 1350×940 @1, RTT 40 ms, 10 Mbit/s, CPU ×1 |
| Runs | 3 par page et par profil, **médiane de chaque métrique** |
| Avant | `origin/main` (commit 89cb384) dans un worktree, `next build` + `next start -p 3101` |
| Après | branche `feat/client-feedback`, `NEXT_DIST_DIR=.next-perf next build` + `next start -p 3100` |
| Public | https://abfastcar.com en direct (réseau réel + simulation) — **condition différente**, à titre indicatif |

Limite connue : la machine exécutait en parallèle les builds des deux autres
agents. Le `benchmarkIndex` de Lighthouse a varié de 650 à 1 420 selon les runs,
ce qui gonfle surtout le TBT et le LCP simulé. Le mobile est le plus sensible.

## Résultats (médianes)

Le tableau final est en bas ; les étapes intermédiaires sont gardées pour la traçabilité.

### Avant — `origin/main`, build de production local (`baseline/`)

| Page | Perf | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|---|
| `/` mobile | 42 | 2,9 s | 11,1 s | 7,9 s | 931 ms | 0 |
| `/` desktop | 76 | 1,0 s | 2,7 s | 2,6 s | 63 ms | 0 |

Élément LCP (mobile et desktop) : `<img src="/images/logo-20ab-20300pp-20.png">`,
le logo PNG de 5311×2372 px / 201 Ko.

### Public — abfastcar.com en direct, mobile (`public-live/`)

| Page | Perf | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|---|
| `/` mobile | 37 | 3,1 s | 14,8 s | 8,8 s | 3 304 ms* | 0 |

\* TBT gonflé par la charge CPU locale pendant la mesure.

## Diagnostic (avant correction)

Décomposition du LCP mobile (`baseline/local-home-mobile-2.report.json`) :
TTFB 469 ms · délai de chargement 310 ms · chargement 367 ms · **délai de rendu 9 809 ms (90 %)**.

Le téléchargement n'était pas le problème. Le premier écran attendait le travail
du thread principal (10,4 s simulées), pour les raisons suivantes :

- tout le texte et la vitrine du hero démarraient en `opacity:0` (`.pre-rise`)
  jusqu'à ce que JavaScript passe `isLoaded` à vrai, puis rejouaient une
  animation d'entrée. Le seul élément visible tôt était donc le logo, qui
  devenait l'élément LCP ;
- 12 photos du carrousel × 2 balises `<img>` (vitrine + fond flouté), toutes en
  chargement immédiat, plus un préchargement JS de chacune. À cela s'ajoutaient
  l'image de fond pleine page (`mercedes-g63.jpg`), les logos de marques
  hébergés chez des tiers (Porsche 562 Ko…) et les avatars pravatar. Au total :
  28 images, 4,8 Mo, 47 requêtes ;
- de grands calques `blur(90px)` animés à l'infini et une `@import` Google Fonts
  (Montserrat 9 graisses + Playfair) dans une balise `<style>` du hero.

## Correctifs appliqués

- **Hero.** Composant serveur : texte, CTA et avantages arrivent en HTML et sont
  visibles dès la première peinture, sans hydratation. Seul le carrousel est un
  îlot client (`hero-showcase.tsx`).
- **Image LCP.** Une seule photo dans le HTML initial : `<picture>` AVIF/WebP,
  `fetchpriority=high`, eager, avec `width`/`height` explicites. Un preload
  correspondant (même `srcset`/`sizes`/`type`) l'accompagne pour éviter un double
  téléchargement.
- **Carrousel.** Les photos suivantes ne sont montées qu'à partir de la page
  `load` + 4 s, une étape à l'avance. Pause au survol/focus/onglet masqué, rien
  avec `prefers-reduced-motion`.
- **Fond du hero.** Aperçu de 24 px (322 octets) au lieu de 12 JPEG floutés, sans
  filtre `blur` CSS.
- **Animations.** Suppression des animations infinies du hero (flottement, reflet,
  halo pulsé, blobs).
- **Photos.** Variantes AVIF/WebP 320/480/640/960 générées par
  `scripts/optimize-images.mjs`. La photo LCP mobile pèse 56 Ko (AVIF 640) contre
  257 Ko pour le JPEG d'origine.
- **Logo.** Version blanche pré-générée de 240×107 px (7,2 Ko en WebP) au lieu du
  PNG de 201 Ko filtré en CSS.
- **Polices.** next/font auto-hébergé (Inter + Montserrat 700–900 préchargées ;
  Playfair italique et Cairo arabe non préchargées). Plus aucune requête Google
  Fonts.
- **Section marques.** Wordmarks texte au lieu de 9 logos tiers (~1 Mo).
- **CSS.** CSS inliné (`experimental.inlineCss`, ~16 Ko) : plus de feuille
  bloquante. `content-visibility:auto` sur les sections sous la ligne de flottaison.
- **Cache.** Photos et logo en `max-age` de 7 jours + `stale-while-revalidate`. Le
  HTML n'est pas figé.

## Étapes intermédiaires

| Étape | `/` mobile Perf / FCP / LCP / SI / TBT | `/` desktop |
|---|---|---|
| v1 (`after-v1/`) : hero + images + polices | 59 / 1,4 s / 4,3 s / 4,4 s / 1 071 ms | 92 / 0,4 s / 1,0 s / 1,7 s / 165 ms |
| v3 (`after/`) : + CSS inliné, content-visibility, hero serveur | 75 / 1,4 s / 4,8 s / 5,9 s / 186 ms | 99 / 0,3 s / 0,9 s / 1,1 s / 20 ms |

Diagnostic v3 (trace `--save-assets`) : le thread principal est presque libre
(JS + layout < 300 ms avant FCP), mais le processus GPU (rendu logiciel) passe
environ 1 s en composition entre 2,2 et 3,3 s, avec 127 frames abandonnées. Les
causes sont les filtres plein écran (`blur-2xl` du fond du hero, `backdrop-blur`
de la barre de navigation fixe et de la barre de réservation mobile fixe) et
l'animation de flottement infinie. Le Speed Index simulé est dérivé de cette
filmstrip observée. Les deux premiers points sont corrigés dans le hero ; les
barres fixes relèvent de `navigation.tsx` et `mobile-book-bar.tsx`.

## Résultat final — build intégré (contenu éditable, hero avec `vehicles`)

Mêmes conditions que « Avant » : médiane de 3 runs.

| Page | | Perf | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` mobile | avant | 42 | 2,9 s | 11,1 s | 7,9 s | 931 ms | 0 |
| `/` mobile | **après** (`final/`) | **73** | **1,4 s** | **4,7 s** | **5,4 s** | **265 ms** | 0 |
| `/` desktop | avant | 76 | 1,0 s | 2,7 s | 2,6 s | 63 ms | 0 |
| `/` desktop | **après** (`final/`) | **99** | **0,3 s** | **0,9 s** | **1,0 s** | **23 ms** | 0,003 |

Pages nouvelles (sans équivalent « avant »), même build sauf la grille décorative
du hero, retirée ensuite (`final-pre-grid/`) :

| Page | Perf | FCP | LCP | SI | TBT | CLS |
|---|---|---|---|---|---|---|
| `/en/fleet` mobile | 63 | 1,3 s | 6,5 s | 3,7 s | 540 ms | 0,021 |
| `/en/fleet` desktop | 94 | 0,3 s | 1,6 s | 0,9 s | 18 ms | 0,003 |
| `/ar` mobile | 64 | 1,4 s | 4,8 s | 3,6 s | 669 ms | 0,005 |
| `/ar` desktop | 96 | 0,4 s | 1,0 s | 1,4 s | 112 ms | 0 |

Élément LCP après : la photo du hero, `lamborghini-urus-640.avif` (mobile) ou
`-480.avif` (desktop). Le chargement n'est plus en cause : délais de chargement
≈ 0, TTFB ≈ 470 ms, le reste est du délai de rendu.

### Objectifs

| Cible | Mobile `/` | Desktop `/` |
|---|---|---|
| Perf ≥ 90 (mobile) / ≥ 95 (desktop) | **non atteint** (73) | atteint (99) |
| SI ≤ 3,4 s (mobile) / ≤ 1,5 s (desktop) | **non atteint** (5,4 s) | atteint (1,0 s) |
| LCP ≤ 2,5 s | **non atteint** (4,7 s) | atteint (0,9 s) |
| FCP ≤ 1,8 s | atteint (1,4 s) | atteint |
| TBT ≤ 200 ms | presque (265 ms) | atteint |
| CLS ≤ 0,1 | atteint | atteint |

### Pourquoi le mobile reste sous l'objectif

Trace d'un run mobile (`--save-assets`, supprimée ensuite) : réseau terminé à
0,3 s (observé), mais **aucun thread ne travaille entre 0,36 et 1,18 s**. La
première peinture a lieu à 1,21 s, puis la frame n'est présentée qu'à 2,8 s :
composition GPU logicielle (≈ 590 ms) et décodage synchrone de l'AVIF (≈ 160 ms).

- Une page HTML témoin minimale peint en 0,1 s dans le même environnement : le
  retard dépend donc du contenu, et non d'un défaut de la machine.
- `--disable-gpu` donne le même ordre de grandeur (FCP observé 2,2 s).
- Lantern (mode simulé, utilisé aussi par PageSpeed Insights) rattache tout le
  travail CPU antérieur au LCP et dérive le SI de cette filmstrip. Le LCP simulé
  colle donc presque au temps d'interactivité.

Pistes restantes, hors de mes fichiers :

1. Réduire le JS hydraté (~216 Ko gzip au premier chargement). La plupart des
   sections restent des composants client ; tous les messages next-intl sont
   envoyés au client.
2. Réduire le HTML (529 Ko bruts / 80 Ko gzip) : payload RSC et CSS inliné
   dupliqué.
3. Retirer `backdrop-blur` des barres fixes (navigation, barre de réservation
   mobile).
4. Remplacer le logo PNG de 201 Ko, toujours préchargé, par
   `/images/logo-ab-fastcar-white.webp`.

Le run expérimental `exp-v4/` (barres fixes sans `backdrop-filter` + grille
retirée) a donné 75 / LCP 4,6 s / SI 5,0 s. La machine était alors bien plus
rapide (`benchmarkIndex` 1 198–1 654 contre 758–1 690 pour `final/`), donc le gain
n'est pas attribuable avec certitude.

## Dossiers

| Dossier | Contenu |
|---|---|
| `baseline/` | avant, `origin/main`, `/` mobile + desktop ×3 |
| `public-live/` | abfastcar.com en direct, mobile ×3 |
| `after-v1/` | étape 1 (hero + images + polices), mobile 3 pages + desktop `/` |
| `after-v2-partial/` | CSS inliné + content-visibility, `/` mobile ×3 (JSON seul) |
| `after-v3/` | hero serveur, 3 pages × mobile/desktop ×3 |
| `final-pre-grid/` | build intégré, 3 pages × mobile/desktop ×3 |
| `final/` | **code final**, `/` mobile + desktop ×3 |
| `exp-v4/` | expérience barres fixes sans flou, `/` mobile ×3 |

`baseline/`, `public-live/` et `final/` contiennent le `.report.json` et le
`.report.html` (à ouvrir dans un navigateur) de chaque run. Les étapes
intermédiaires ne gardent que le JSON, pour limiter la taille (61 Mo au total) ;
on peut le recharger dans le Lighthouse Viewer.

Les outils de mesure (`run.sh`, `summary.js`) ont été exécutés depuis un
dossier hors du dépôt (`C:\Users\HP\lhtool`, Lighthouse 12.6.1 installé par npm).

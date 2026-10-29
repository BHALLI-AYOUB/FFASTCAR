# AB FAST CAR — rapport d’intégration Codex

29 octobre 2026. Travail effectué dans le dépôt existant avec exactement trois agents Codex, sans installation de dépendances, réinitialisation ou publication en production. Les modifications locales antérieures sont conservées ; ce rapport distingue les changements de cette reprise du chantier déjà présent.

## Résultat fonctionnel

Les deux vidéos préparées s’affichent après la flotte et avant les étapes de réservation : film horizontal et portrait côte à côte sur ordinateur, cartes empilées sur mobile. Le lecteur et la source sont créés après clic ; aucune requête MP4/MOV n’est effectuée lors du chargement ou du défilement. Une seule source est chargée par lecture, avec le film 720p sur mobile. Lecture, audio décodé non muet, volume, recherche, commandes natives, fermeture, Échap, focus et blocage/restauration du défilement ont été vérifiés sous Chrome avec sa politique normale d’autoplay. Une erreur réseau vidéo propose un réessai qui récupère la lecture.

Les conditions existent en français, anglais, néerlandais et arabe, dans le HTML initial : 16 articles, 63 paragraphes, sous-titres, sommaire et ancres. Le français est conservé à l’identique, avec l’empreinte source attendue. Présentation mobile, RTL, impression, liens footer et réservation, canonical/hreflang, sitemap et llms sont raccordés. Le formulaire ouvre la vraie page des conditions, sans envoyer de demande WhatsApp.

L’admin expose titres/légendes quatre langues, sources, couvertures, dimensions, visibilité et ordre des vidéos ainsi que les conditions quatre langues. La persistance, les contrôles d’accès et l’invalidation sont vérifiés localement. Les anciens documents reçoivent les champs manquants tout en conservant véhicules, prix, coordonnées et réponses personnalisées. Seules les anciennes réponses FAQ standard exactes sont migrées. Le stockage Blob à versions immuables est conservé sans changement.

## Causes des blocages et corrections

1. **Section vidéo introuvable.** Le build `.next-perf` conservé était daté de 11:00 (Maroc), le composant vidéo de 11:05, et le HTML généré ne contenait pas la section. Aucun fichier de contenu local sauvegardé n’était présent. Le port 3100 était encore occupé par un ancien serveur et ne connaissait pas `/conditions`. La vérification du code actuel sur un serveur neuf produit bien `id="videos"` sur toutes les langues ; `/fr` redirige vers `/`.
2. **Conditions incomplètes.** Les traductions manquantes et la route ont été ajoutées ; les contrôles confrontent le français à la source et vérifient aussi les paragraphes traduits dans le HTML, sans raccourcir les textes ou affaiblir les exigences.
3. **Focus à la fermeture.** Le test a révélé que le retour de focus était demandé pendant que le dialogue natif rendait encore la carte inerte. Le dialogue est maintenant fermé avant démontage, puis le focus est restauré après le rendu.
4. **Protection des données legacy.** La revue a identifié une migration de FAQ trop large. Elle utilise désormais l’égalité stricte avec les quatre anciennes réponses standard ; des réponses personnalisées étendues restent intégralement conservées. Un deuxième build de stabilisation était nécessaire pour cette correction. Aucune mesure de performance n’a été lancée sur le premier candidat.

## Build et vérifications

Build final : `.next-perf`, **BUILD_ID `xQmby86mMz8qdTQJedPoH`**, serveur neuf `http://localhost:3211`. Le serveur de développement possédé par cette reprise a été arrêté avant le build final. Le port 3100 est exclu des vérifications finales.

| Contrôle | Résultat et preuve |
|---|---|
| `pnpm exec tsc --noEmit` | Réussi ; `reports/integration/typescript-final.log` et contrôle TypeScript du build |
| `NEXT_DIST_DIR=.next-perf pnpm build` | Réussi, 111 pages générées ; `reports/integration/build-final.log`. Le contournement `ignoreBuildErrors` a été retiré. |
| Source conditions et HTML quatre langues | Réussi ; `reports/integration/conditions-source-final.log` |
| Routes publiques | **114 contrôles réussis**, dont les **104 URL** du sitemap, canonical/hreflang, 404, redirections, noindex local et réponses MP4 `206 video/mp4` ; `reports/integration/public-routes-final.json` |
| Admin et migration | **22 contrôles réussis**, 0 erreur ; `reports/integration/admin-results.json` |
| Conditions navigateur | **55 contrôles réussis**, 8 présentations ; `reports/integration/final-conditions/conditions-results.json` |
| Vidéos navigateur | 8 présentations vérifiées ; `reports/integration/final-videos/video-results.json` et réexécution FR mobile sous `final-videos-recheck-frmobile/` |
| `git diff --check` | Réussi ; avertissements CRLF uniquement |
| `pnpm lint` | **Non exécuté avec succès : ESLint est absent.** Aucune dépendance ajoutée pour masquer cette limite. |

Le premier contrôle vidéo du focus a échoué puis a permis la correction du produit ; son rapport reste dans `reports/integration/dev/`. Le premier échantillonnage de lecture FR mobile du candidat de production arrivait à `currentTime=0` malgré le décodage audio et `paused=false`. Le test attend maintenant une progression réelle plutôt qu’un délai fixe de 500 ms ; la réexécution ciblée passe. Les rapports initiaux sont conservés, pas réécrits pour dissimuler ces observations.

Les essais admin utilisent une session locale signée en mémoire depuis la configuration existante : aucune valeur d’identifiant, hash, secret ou cookie n’est écrite dans les rapports. La saisie du mot de passe dans le formulaire de connexion n’est pas exercée. Les sauvegardes apparaissent dans une session publique indépendante et dans les quatre langues ; nouveau véhicule 200, véhicule masqué/supprimé 404, vidéo masquée absente, refus 401/403/409 et source MOV refusée 400. Les données d’avant test sont restaurées exactement ; `.data/site-content.json` était et reste absent.

## Captures et médias

Captures utiles inspectées visuellement :

- `reports/integration/final-captures/fr-desktop-videos.png`
- `reports/integration/final-captures/fr-mobile-videos.png`
- `reports/integration/final-captures/fr-mobile-portrait.png`
- `reports/integration/final-captures/ar-mobile-videos.png`
- `reports/integration/final-conditions/fr-mobile-conditions.png`
- `reports/integration/final-conditions/ar-desktop-conditions.png`
- `reports/integration/final-conditions/conditions-fr-print.pdf`

Les premières captures de section hors écran sont remplacées pour la revue par les captures du viewport dans `final-captures/` : `content-visibility:auto` change les dimensions des sections éloignées et rendait certains clips incomplets. Aucun style du site n’a été modifié pour fabriquer les captures.

Les originaux `IMG_0051.MOV` (73 850 940 octets) et `IMG_0053.MOV` (92 226 326 octets) sont conservés. Copies réutilisées sans conversion : film 7 403 386 octets, variante mobile 3 750 943 octets, portrait 5 794 312 octets, couvertures WebP 34 010 et 28 482 octets. Aucune URL MOV demandée par le site pendant les tests. Les réponses partielles HTTP vérifient la lecture progressive/recherche des trois MP4.

## Fichiers de cette reprise

Le dépôt contenait déjà un grand ensemble de changements suivis et non suivis. Les fichiers de ce lot complètent ce travail, sans le remplacer :

- Lecteur : `components/video-launcher.tsx`, `components/video-player-dialog.tsx` ; section et insertion dans `app/[locale]/page.tsx` déjà présentes, contrôlées et conservées.
- Conditions : `lib/content/conditions/en.json`, `nl.json`, `ar.json`, `defaults.ts` ; FR existant conservé ; `app/[locale]/conditions/page.tsx` et `conditions.module.css`.
- Contenu/admin : `lib/content/types.ts`, `defaults.ts`, `validate.ts`, `index.ts`, `migrate.ts` ; `components/admin/admin-editor.tsx`, `videos-editor.tsx`, `conditions-editor.tsx`.
- Langues et liens : `messages/{fr,en,nl,ar}.json`, `messages/seo/{fr,en,nl,ar}.json`, `components/footer.tsx`, `components/booking-form.tsx`, `lib/seo.ts` ; sitemap alimenté par `publicPaths`, `app/llms.txt/route.ts`.
- Performance/build : `next.config.mjs`, `scripts/perf/run.mjs`, `scripts/perf/summary.mjs`, `reports/perf/README.md` ; `.gitignore` ignore le dossier de vérification temporaire. Aucune dépendance ajoutée.
- Vérification : scripts `check-conditions.mjs`, `check-conditions-browser.mjs`, `check-integration.mjs`, `check-admin-integration.mjs`, `check-public-routes.mjs`, `inspect-video-state.mjs`, `capture-videos.mjs` et rapports associés.
- Documentation : `docs/ADMIN.md`, `docs/REPRISE-CODEX.md`, ce rapport.

## Performances finales

Campagne à renseigner après les 24 audits sur le seul build final : accueil FR mobile/desktop, accueil AR mobile, flotte EN mobile ; trois passages par scénario et par protocole. Simulé et DevTools sont séparés, avec métriques observées distinctes, cache frais et paramètres conservés. Aucun build, test navigateur ou changement de contenu ne doit accompagner la campagne.

Choix CSS : externe par défaut, `NEXT_INLINE_CSS=1` pour reproduire la variante inline. Les rapports historiques `baseline2`, `js-inline`, `js-nocss` et DevTools ont été relus. Le gain historique certain du CSS externe est une baisse de transfert d’environ 30 Ko ; les scores historiques et l’ancien 73/100 ne sont pas présentés comme des mesures du code final. Les rapports historiques ne permettent pas d’attribuer une variation faible de LCP au seul code, car la puissance CPU du poste variait beaucoup.

## Limites et suite Vercel

- **Rabat** : article 10 conservé intégralement. Le client doit confirmer cette juridiction malgré l’agence à Marrakech ; aucune substitution automatique.
- **Appareils** : Chrome local vérifié, avec profils desktop et mobile ; Safari/iPhone et Chrome Android physiques non disponibles. Décodage audio et commandes vérifiés ; écoute humaine et présence éventuelle d’informations parlées essentielles à confirmer avant de produire des sous-titres. Aucune transcription inventée.
- **Vercel** : le connecteur est accessible en lecture, mais la CLI locale ne trouve pas d’identifiants et le checkout n’est pas lié. La liste retournée ne confirme aucun projet pour `abfastcar.com` ; `ffastcar` n’expose que des domaines Vercel et n’a pas été choisi automatiquement. Aucun test Blob en ligne ni déploiement de ce code.
- **Action interactive** : exécuter `vercel login` puis `vercel link` dans le dépôt, choisir le compte/projet confirmé et vérifier `vercel project inspect --non-interactive`. Configurer Blob et les variables admin sur Preview via le tableau de bord, puis déployer une preview et y rejouer la sauvegarde/inter-session/invalidation et le contrôle du parcours public. Aucun secret à transmettre dans le chat. Production uniquement après autorisation.

Références techniques consultées : [MDN — vidéo HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) et [web.dev — chargement différé des vidéos](https://web.dev/articles/lazy-loading-video). Les résultats ci-dessus proviennent des essais locaux et de leurs rapports, pas de ces références.

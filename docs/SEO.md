# SEO, indexation et visibilité IA — AB FAST CAR

Ce document décrit ce que le code fait déjà et ce qu'Ayoub doit faire en dehors du code : Search Console, domaine Vercel et informations à confirmer.

## 1. Ce que le site publie

| Élément | Où | Comportement |
|---|---|---|
| Pages | `app/[locale]/…` | `/`, `/fleet`, `/fleet/<véhicule>` (21 à l'origine), `/faq`, `/contact`, `/conditions` en 4 langues : français sans préfixe, `/en`, `/nl`, `/ar` |
| Contenu | rendu serveur / statique | Le HTML initial contient les textes, la flotte et les prix ; aucun contenu différent pour les robots |
| Title, description, canonical, hreflang, Open Graph | `lib/seo.ts`, textes dans `messages/seo/<langue>.json` | Une canonical par page et par langue sur `https://abfastcar.com` ; hreflang `fr`, `en`, `nl`, `ar-MA` + `x-default` (français) |
| Devise | affichage uniquement | Jamais dans l'URL : aucune variante indexable par devise |
| Données structurées | `components/structured-data.tsx` | `AutoRental` + `WebSite` (toutes les pages), `BreadcrumbList`, `Car` + `Offer` en MAD par jour (fiches véhicules), `FAQPage` (FAQ). Aucun avis, note, récompense ou disponibilité |
| robots.txt | `app/robots.ts` | Voir §4 |
| sitemap.xml | `app/sitemap.ts` | Généré depuis le contenu (`lib/content`) : `(véhicules visibles + 5) × 4` URL, soit 104 avec les 21 véhicules d'origine, alternates hreflang ; les véhicules masqués dans l'admin en sont retirés ; `lastmod` = la plus récente de `SITE_LAST_UPDATED` (`lib/seo-dates.ts`) et de la dernière sauvegarde admin |
| llms.txt | `app/llms.txt/route.ts` | Résumé factuel en Markdown, généré depuis le contenu publié (`lib/content`) : flotte visible, prix et contact à jour après chaque sauvegarde admin |
| 404 | `app/[locale]/[...rest]` + `not-found.tsx` | Statut 404 réel, aucun faux 200 ; les slugs de véhicule inconnus renvoient aussi 404 |

Les modifications faites dans l'admin mettent à jour le sitemap, llms.txt et le JSON-LD sans redéploiement (voir `docs/ADMIN.md`). `SITE_LAST_UPDATED` dans `lib/seo-dates.ts` n'est à changer que lors d'un déploiement qui modifie les pages elles-mêmes.

## 2. Production et préproduction

- L'indexation est autorisée uniquement si `VERCEL_ENV === "production"` (ou `NEXT_PUBLIC_INDEXABLE=true` hors Vercel). Voir `lib/site.ts`.
- Les previews Vercel et les builds locaux reçoivent `<meta name="robots" content="noindex, nofollow">`. Leur robots.txt reste **ouvert** pour que les robots puissent lire ce `noindex` : un `Disallow` le rendrait invisible.
- La canonical pointe toujours vers `https://abfastcar.com`, même sur le domaine `*.vercel.app` de production.

### Réglages Vercel à faire (non configurables dans le code)

1. **Settings → Domains** : ajouter `abfastcar.com` et `www.abfastcar.com`. Mettre `abfastcar.com` en domaine principal et régler `www.abfastcar.com` sur « Redirect to abfastcar.com » avec le code **308 (permanent)**.
2. Rediriger également le domaine `ffastcar-amber.vercel.app` vers `abfastcar.com` si Vercel le permet pour ce projet. Sinon, la canonical suffit à consolider.
3. **Settings → Deployment Protection** : activer « Vercel Authentication » pour les **Preview Deployments** (pas pour la production).
4. Vérifier que le projet Vercel qui sert `abfastcar.com` est bien celui relié à ce dépôt. Le README mentionne aussi un projet v0 (`v0-fastcarr`).

Après déploiement, contrôler :

```bash
curl -sI https://www.abfastcar.com/ | grep -i -E "^(HTTP|location)"   # attendu : 308 → https://abfastcar.com/
curl -sI https://abfastcar.com/index.html | head -1                     # attendu : 308 vers / (redirection demandée à l'agent performance) ou 404, jamais 200
curl -s https://abfastcar.com/robots.txt
curl -s https://abfastcar.com/sitemap.xml | grep -o "<loc>" | wc -l   # attendu : (véhicules visibles + 5) × 4, 104 avec la flotte initiale
curl -s https://abfastcar.com/ | grep -o '<meta name="robots"[^>]*>'   # attendu : index, follow
```

## 3. Google Search Console — procédure

Rien de ceci n'a été fait : il faut l'accès au compte Google d'Ayoub et au DNS du domaine.

1. Ouvrir <https://search.google.com/search-console> avec le compte qui gérera le site.
2. **Ajouter une propriété → Domaine** et saisir `abfastcar.com` (couvre http/https, www et non-www).
3. Google affiche un enregistrement **TXT** du type `google-site-verification=…`. Copier **la valeur exacte affichée** et l'ajouter dans la zone DNS du domaine (chez le registrar ou dans Vercel → Domains → DNS records). Ne pas utiliser de valeur d'exemple.
4. Revenir dans Search Console et cliquer **Valider** (la propagation DNS peut prendre de quelques minutes à quelques heures).
5. **Sitemaps** : soumettre `https://abfastcar.com/sitemap.xml`. Statut attendu : « Opération effectuée » avec le nombre d'URL réellement publiées (104 avec la flotte initiale).
6. **Inspection d'URL** puis **Tester l'URL en ligne** et **Demander une indexation** pour les pages prioritaires :
   - `https://abfastcar.com/`
   - `https://abfastcar.com/fleet`
   - `https://abfastcar.com/faq`
   - `https://abfastcar.com/contact`
   - `https://abfastcar.com/en`, `https://abfastcar.com/nl`, `https://abfastcar.com/ar`
   - 2 ou 3 fiches véhicules, par exemple `https://abfastcar.com/fleet/mercedes-g63`
   Pour chaque URL, vérifier dans le test en ligne : « L'URL peut être indexée », canonical déclarée = canonical choisie par Google, capture du rendu complète.
7. **Suivi (hebdomadaire au début)** : Indexation → Pages. Surveiller « Explorée, actuellement non indexée », « Autre page avec balise canonique correcte » (normal pour `ffastcar-amber.vercel.app`), « Introuvable (404) », « Exclue par la balise noindex » (ne doit concerner aucune URL de production). Améliorations → Fil d'Ariane et Données structurées : corriger toute erreur.
8. Faire la même chose dans **Bing Webmaster Tools** (<https://www.bing.com/webmasters>) : l'import depuis Search Console est possible. Bing alimente aussi certains moteurs IA.

### Trois états à ne pas confondre

| État | Signification | Comment le savoir |
|---|---|---|
| Techniquement indexable | La page répond 200, n'a pas de `noindex`, a une canonical vers elle-même et n'est pas bloquée par robots.txt | `curl` ci-dessus, test en ligne de l'Inspection d'URL |
| Sitemap soumis | Google connaît la liste des URL | Rapport Sitemaps de Search Console |
| Indexé | Google a choisi d'inclure la page dans son index | Inspection d'URL : « L'URL est sur Google » |

Aucun délai d'indexation, aucune position et aucune citation dans une IA ne peuvent être garantis.

## 4. Robots et robots d'IA

Sources officielles consultées le 2026-10-28 :
[Google](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers),
[OpenAI](https://developers.openai.com/api/docs/bots),
[Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler),
[Perplexity](https://docs.perplexity.ai/guides/bots),
[Common Crawl](https://commoncrawl.org/ccbot).

| Robot | Rôle | Réglage en production |
|---|---|---|
| Googlebot | Recherche Google | Autorisé |
| Bingbot | Recherche Bing | Autorisé |
| OAI-SearchBot | Résultats de recherche ChatGPT | Autorisé |
| ChatGPT-User | Visite déclenchée par un utilisateur ChatGPT (peut ignorer robots.txt) | Autorisé |
| Claude-SearchBot | Index de recherche de Claude | Autorisé |
| Claude-User | Visite déclenchée par un utilisateur de Claude | Autorisé |
| PerplexityBot | Résultats de recherche Perplexity | Autorisé |
| Perplexity-User | Visite déclenchée par un utilisateur (ignore généralement robots.txt) | Autorisé |
| GPTBot | Entraînement des modèles OpenAI | **Bloqué par défaut** |
| ClaudeBot | Entraînement des modèles Anthropic | **Bloqué par défaut** |
| CCBot | Corpus Common Crawl, souvent réutilisé pour l'entraînement | **Bloqué par défaut** |
| Google-Extended | Jeton de contrôle (pas un robot) : entraînement Gemini **et** ancrage des réponses Gemini | Non bloqué (relève de `*`) |

Décision par défaut : la visibilité dans les moteurs et les réponses d'IA dépend des robots de **recherche et de récupération**, pas de ceux d'**entraînement**. Bloquer GPTBot, ClaudeBot ou CCBot ne retire pas le site de ChatGPT search, Claude ou Perplexity.

Google-Extended n'est pas bloqué, parce qu'il contrôle aussi l'ancrage des réponses Gemini sur le contenu du site. Il n'a aucun effet sur Google Search ni sur son classement.

Ces deux choix relèvent d'Ayoub :
- pour autoriser l'entraînement, mettre `ALLOW_AI_TRAINING = true` dans `app/robots.ts` ;
- pour bloquer Gemini, ajouter `Google-Extended` à `TRAINING_BOTS`.

`/llms.txt` est un complément documentaire facultatif. Ce n'est ni un prérequis Google ni une garantie de citation.

## 5. Informations qu'Ayoub doit confirmer

La FAQ, le JSON-LD et llms.txt ne publient que ce que le site affichait déjà. Les points suivants sont absents ou non vérifiés. Ils sont aujourd'hui renvoyés vers « contactez-nous » ou omis :

1. Caution / dépôt de garantie (montant, mode).
2. Documents exigés (permis, ancienneté du permis, passeport/CIN).
3. Âge minimum du conducteur.
4. Assurance incluse et franchise.
5. Moyens de paiement acceptés et devises acceptées sur place.
6. Conditions d'annulation et de modification.
7. Frais et délais de livraison (domicile, aéroports : lesquels ?).
8. Conditions de kilométrage par véhicule et durée : l'article 14 renvoie au contrat ; aucune promesse de kilométrage illimité n'est publiée.
9. Tarif du service chauffeur.
10. Horaires réels de l'agence physique (le site annonce « 24h/24 »).
11. Code postal et adresse complète de l'agence ; position GPS exacte (celle du JSON-LD vient du lien Google Maps fourni par Ayoub : 31.6737595, -8.0252161, Marrakech ; rue encore à fournir).
12. Fiche Google Business Profile existante (URL) : à ajouter à `sameAs` seulement si elle existe.
13. Nombre réel de véhicules (« 50+ véhicules » dans le hero contre 21 véhicules publiés).

La page « Conditions de location » publie désormais les 16 articles du client en français (source), anglais, néerlandais et arabe. Les réserves de l'article 4 (franchise de 5 %) et de l'article 11 (150 MAD de lavage conditionnels) sont reprises dans la FAQ. Le détail de la caution, des garanties, de l'annulation et des remboursements reste celui du contrat. La juridiction de Rabat, citée à l'article 10 malgré l'adresse de Marrakech, reste à faire confirmer sans modifier la clause fournie.

## 6. Avis Google (plus tard)

Aucun avis ni note n'est publié, y compris dans les données structurées. Pour réintroduire des avis authentiques, passer par l'API Google Business Profile ou Places, appelée côté serveur avec une clé non exposée au client. Dans ce cas, ne pas baliser ces avis en `Review`/`AggregateRating` sur la propre entité de l'entreprise : Google ignore les avis « auto-publiés » pour les LocalBusiness.

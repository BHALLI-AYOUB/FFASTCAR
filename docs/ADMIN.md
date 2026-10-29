# Administration du contenu — AB FAST CAR

L'admin permet de modifier sans redéploiement la flotte (prix, photos, véhicules masqués ou mis en avant), les coordonnées et les principaux textes des 4 langues. Ce document couvre la mise en service, l'interface et le fonctionnement côté serveur.

**Adresse : `/admin`** (par exemple https://abfastcar.com/admin). La page n'est pas indexée par les moteurs de recherche et n'apparaît dans aucun menu du site.

## 1. Mise en service sur Vercel (à faire par Ayoub)

1. **Créer un stockage Blob.** Vercel → projet → *Storage* → *Create* → *Blob*, puis le connecter au projet (Production et Preview). Vercel ajoute alors `BLOB_READ_WRITE_TOKEN`. Sans lui, le site affiche le contenu d'origine et toute sauvegarde est refusée (« stockage indisponible »).
2. **Générer le mot de passe haché**, sur l'ordinateur, dans le dossier du projet :
   ```
   node scripts/hash-admin-password.mjs
   ```
   Saisir un mot de passe de 12 caractères minimum, puis copier la ligne `ADMIN_PASSWORD_HASH=…` affichée. Le mot de passe lui-même n'est stocké nulle part.
3. **Générer le secret de session :**
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
4. **Ajouter les variables** dans Vercel → *Settings* → *Environment Variables*, pour l'environnement *Production* :
   | Nom | Valeur |
   |---|---|
   | `ADMIN_EMAIL` | l'adresse de connexion |
   | `ADMIN_PASSWORD_HASH` | la valeur de l'étape 2 |
   | `ADMIN_SESSION_SECRET` | la valeur de l'étape 3 |
5. **Redéployer** pour que les variables soient prises en compte.

La liste complète des variables est dans `.env.example`. Ne jamais committer de vraie valeur : `.env*` est ignoré par git, sauf `.env.example`.

**Changer le mot de passe :** refaire l'étape 2, remplacer `ADMIN_PASSWORD_HASH`, puis redéployer. Toutes les sessions ouvertes sont fermées.

## Utiliser l'interface

L'interface est en français, avec cinq onglets :

- **Véhicules :** la liste, dans l'ordre du site (flèches pour réordonner). Un clic ouvre la fiche : photo principale, nom, marque, année, prix par jour en MAD, visible ou masqué, catégorie et équipements dans les 4 langues, galerie (jusqu'à 12 photos ; l'étoile en fait la photo principale). **Ajouter** crée un véhicule ; son identifiant d'adresse est tiré du nom et ne peut plus changer après le premier enregistrement. Pour retirer un véhicule temporairement, décocher « Visible sur le site » plutôt que le supprimer.
- **Contact :** téléphone, WhatsApp, email, réseaux sociaux, adresse et position sur la carte.
- **Textes :** un onglet par langue, avec le référencement Google de l'accueil (compteur de caractères), le grand titre, « À propos », les services et la FAQ.
- **Vidéos :** titres et légendes dans les quatre langues, liens MP4 principal et petit écran, couverture, dimensions, visibilité et flèches d'ordre. Seuls les fichiers préparés sous `/videos/` ou des liens HTTPS vers des fichiers MP4/images sont acceptés. Aucun upload ou transcodage vidéo n'est proposé ; l'upload de photos reste réservé aux images.
- **Conditions :** titre, introduction, 16 articles et paragraphes dans les quatre langues. Le texte français initial reste visible comme référence en lecture seule ; son fichier `docs/client/conditions-location-client-fr.txt` est conservé intact. Les 16 articles, 63 paragraphes et deux sous-titres sont requis par la validation. Les traductions doivent conserver les montants, réserves et exceptions. L'article 10 mentionne Rabat, distinct de l'adresse de Marrakech : demander une instruction précise au client avant de changer cette juridiction.

Rien n'est publié tant que l'on n'a pas cliqué sur **Enregistrer** (barre en bas de l'écran). En cas d'erreur, rien n'est enregistré : la liste des points à corriger s'affiche en haut, et chaque champ concerné est signalé en rouge. Le bouton **Annuler** revient à la dernière version enregistrée.

Les photos de plus de 4 Mo (photos de téléphone) sont réduites dans le navigateur avant l'envoi. Les photos HEIC de plus de 4 Mo ne peuvent être réduites que depuis Safari ; ailleurs, les exporter d'abord en JPEG.

Le code de l'interface est dans `app/admin/` et `components/admin/`. Il n'est chargé que sur `/admin`, jamais sur les pages publiques.

## 2. Ce qui est modifiable

Le contenu est un seul document JSON, dont le type est défini dans `lib/content/types.ts` :

- **Véhicules :** nom, marque, année, prix par jour en MAD, catégorie et caractéristiques dans les 4 langues, photo principale, galerie, `hidden` (masqué) et `featured` (ancien carrousel d'accueil, conservé dans les données mais plus affiché : le hero montre désormais les vidéos). L'ordre de la liste est l'ordre d'affichage. Le `slug` sert d'adresse (`/fleet/<slug>`) et ne doit pas changer après la création.
- **Coordonnées :** téléphone, WhatsApp, email, Instagram, Facebook, rue, code postal, ville, pays et position GPS. La rue et le code postal restent vides tant qu'ils ne sont pas confirmés : ils n'apparaissent alors ni sur le site ni dans les données structurées.
- **Textes par langue :** title et description de l'accueil, accroche du hero, « À propos », services et FAQ. Ils remplacent clé par clé ceux de `messages/` (fusion dans `i18n/request.ts`) ; tous les autres textes restent ceux du code.
- **Vidéos et conditions :** stockées dans le même document et avec les mêmes contrôles d'accès, ETag et invalidation de cache. Les conditions sont rendues côté serveur sur `/conditions`, `/en/conditions`, `/nl/conditions`, `/ar/conditions`, sans dépendre du JavaScript du navigateur.

**Migration :** le schéma reste compatible avec la version 1. À la lecture d'un ancien document, les seuls champs absents `videos` et `conditions` reçoivent les valeurs initiales ; les véhicules, prix, coordonnées et textes personnalisés sont conservés. Les anciennes réponses standard de FAQ annonçant le kilométrage illimité ou des conditions non publiées sont actualisées. Aucune version Blob n'est modifiée lors de la lecture : les nouveaux champs seront persistés à la prochaine sauvegarde explicite, dans une nouvelle version immuable. La clé de cache publique a été changée pour éviter un ancien document déjà en cache sans ces champs.

Tant que rien n'a été enregistré, le site affiche le contenu d'origine (`lib/content/defaults.ts`, construit à partir de `lib/fleet.ts`, `lib/site.ts` et `messages/`).

## 3. Effet d'une sauvegarde

Chaque page lit le contenu via `lib/content` (`getSiteContent`, `getPublicContent`, `getVisibleVehicles`, `getVehicle`), avec un cache étiqueté `site-content`. Une sauvegarde valide :

1. écrit une nouvelle version du document dans Blob, `content/versions/00000001.json`, `00000002.json`, etc. (ou dans `.data/site-content.json` en local) ;
2. appelle `revalidateTag("site-content", { expire: 0 })` : la visite suivante relit le contenu.

Sont mis à jour sans redéploiement : toutes les pages, le JSON-LD (`AutoRental`, `Car` + `Offer`), `/sitemap.xml` et `/llms.txt`. Un véhicule masqué renvoie un vrai 404 et sort du sitemap, de `llms.txt`, et de la flotte. Le `lastmod` du sitemap prend la date de la dernière sauvegarde.

Seuls les véhicules visibles et les coordonnées sont envoyés au navigateur (`getPublicContent`). Les véhicules masqués restent côté serveur.

## 4. API (`app/api/admin/*`)

Le contrat complet est en commentaire dans `lib/content/types.ts`. Toutes les réponses sont en JSON avec `Cache-Control: no-store`.

| Route | Rôle |
|---|---|
| `POST /api/admin/login` | `{email, password}` → cookie de session. 401 `invalid_credentials`, 429 `too_many_attempts` |
| `POST /api/admin/logout` | supprime le cookie |
| `GET /api/admin/session` | `{authenticated, email?}` |
| `GET /api/admin/content` | `{content, etag, storage, saveTo}`, lu directement dans le stockage, sans cache. `saveTo` indique où irait une sauvegarde : `blob`, `filesystem` ou `none` (aucun store Blob sur Vercel) |
| `PUT /api/admin/content` | `{content, etag}` → 200, 400 `invalid` + `issues[{path, message}]`, 409 `conflict`, 503 `storage_unavailable` |
| `POST /api/admin/upload` | formulaire avec un champ `file` → `{image: ImageAsset}` ; 400 `invalid_file`, 413 `too_large`, 415 `unsupported_type` |

**Validation** (`lib/content/validate.ts`) : chaque champ est vérifié et borné côté serveur (prix entier en MAD, slugs uniques en minuscules, email, liens https, téléphone au format international, au moins un véhicule visible…). Les clés inconnues sont ignorées. Un document invalide n'est jamais enregistré.

**Conflits :** chaque lecture renvoie un `etag`, le numéro de version (`v12`). Si quelqu'un a enregistré entre-temps, la sauvegarde est refusée (409) au lieu d'écraser son travail ; il faut recharger puis refaire la modification.

**Pourquoi des versions plutôt qu'un fichier réécrit :** un blob public est lu à travers le CDN de Vercel, et `@vercel/blob` 2.8.1 ne contourne ce cache (`useCache: false`) que pour les blobs privés. Après une réécriture au même chemin, le CDN peut donc servir l'ancien document pendant un moment. La page relue juste après la sauvegarde garderait alors l'ancienne version en cache jusqu'à la sauvegarde suivante. Avec des versions, rien n'est jamais réécrit :
- la dernière version est trouvée par `list()`, qui interroge l'API Blob et non le CDN ;
- son URL ne change jamais de contenu ;
- la version suivante est créée avec `allowOverwrite: false` : si deux personnes enregistrent sur la même version, le service Blob refuse la seconde création et la seconde sauvegarde reçoit un 409.

Les 20 dernières versions sont conservées (retour arrière manuel possible dans le store Blob), les plus anciennes sont supprimées après chaque sauvegarde.

**Photos :** formats JPEG, PNG, WebP, AVIF ou HEIC, 4 Mo maximum (Vercel limite le corps d'une requête à 4,5 Mo) et 320 px minimum. Le type est vérifié sur le contenu du fichier, pas sur son nom. Chaque photo est convertie, comme les photos d'origine, en AVIF et WebP de 320, 480, 640 et 960 px, plus un aperçu flou. L'original et ses métadonnées EXIF (dont la position GPS) ne sont pas conservés. Les fichiers sont stockés dans Blob, sous `uploads/<date>-<id>/`, ou dans `public/uploads/` en local.

## 5. Sécurité

- Un seul compte, défini par variables d'environnement. Le mot de passe est vérifié contre un hash scrypt, avec une comparaison en temps constant.
- Le cookie de session `abfc_admin` est signé (HMAC-SHA256), `HttpOnly`, `SameSite=Strict`, `Secure` en production et valable 8 heures. Changer le mot de passe ou `ADMIN_SESSION_SECRET` invalide toutes les sessions.
- Les requêtes d'écriture (`PUT`, `POST`) venant d'un autre site (en-tête `Origin` différent) sont refusées.
- Après 5 échecs de connexion en 15 minutes depuis la même adresse IP, l'IP est bloquée.

**Limites connues :**
- Le compteur d'échecs est gardé en mémoire. Sur Vercel, chaque instance de fonction a le sien : il ralentit les essais sans constituer une limite globale stricte. Il faut donc un mot de passe long et unique. Pour une limite globale, il faudrait un stockage partagé (Vercel KV ou Upstash, par exemple).
- La session n'est pas stockée côté serveur. La déconnexion supprime le cookie du navigateur, mais un cookie copié avant la déconnexion reste valable jusqu'à son expiration (8 h maximum). Pour couper toutes les sessions immédiatement, il faut changer `ADMIN_SESSION_SECRET`.
- `BLOB_ACCESS=private` n'est utile qu'avec un store Blob privé. Les photos envoyées ne seraient alors plus lisibles par les visiteurs sans une route proxy, qui n'existe pas encore. Il faut garder `public` (valeur par défaut) : le contenu stocké est de toute façon affiché sur le site.

## 6. Développement local

Sans `BLOB_READ_WRITE_TOKEN`, l'admin enregistre dans `.data/site-content.json` et `public/uploads/`. Les deux dossiers sont ignorés par git.

Pour tester l'admin en local, définir `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` et `ADMIN_SESSION_SECRET` dans `.env.local` (ignoré par git). **Ne pas** mettre le `BLOB_READ_WRITE_TOKEN` de production dans `.env.local` : les essais écriraient sur le site en ligne.

Pour revenir au contenu d'origine en local, supprimer `.data/` et `public/uploads/`, puis `.next/dev/cache/fetch-cache/` (le serveur de dev y garde la dernière lecture).

En production, la même remise à zéro consiste à supprimer le dossier `content/versions/` dans le store Blob, puis à vider le cache de données du projet sur Vercel (*Settings* → *Caches*). Sans cette purge, les pages continuent d'afficher la dernière version lue. Pour revenir à une version précédente, supprimer les versions plus récentes, puis purger de la même façon. Ces procédures n'ont pas été testées sur Vercel.

# AB FAST CAR — intégration des vidéos et des conditions de location

Tu travailles dans le projet existant C:\Users\HP\abfastcar. Le client a demandé d’ajouter deux vidéos et ses conditions de location, sans imposer leur emplacement. Implémente la proposition ci-dessous avec une présentation soignée sur mobile et ordinateur. Préserve le travail déjà réalisé sur le site et l’admin.

## Organisation

Conserve exactement 3 agents au total, coordinateur compris : agent 1 intégration et interface ; agent 2 médias et performance ; agent 3 conditions, langues, SEO et raccordement à l’admin existant. Réutilise les agents déjà disponibles et ne crée aucun agent supplémentaire. Attribue un propriétaire à chaque fichier partagé.

Inspecte d’abord les instructions du dépôt et ses conventions. Travaille sur la branche de travail existante, sans écraser les changements d’Ayoub. Ne crée pas un nouveau site, une nouvelle stack ou un gros backend.

## Sources et fichiers préparés

Les originaux du client sont dans le dossier public du projet :
- IMG_0051.MOV : montage horizontal de plusieurs véhicules, 3840 × 2160, environ 21,7 secondes, 73 850 940 octets.
- IMG_0053.MOV : visite verticale d’un espace de présentation automobile, 2160 × 3840, environ 22,7 secondes, 92 226 326 octets.

Les deux originaux pèsent ensemble environ 166 Mo. Conserve-les sans les modifier et n’utilise pas leurs URL pour la lecture publique. Ne déduis pas du montage la disponibilité, l’année, la finition ou le prix d’une voiture.

Un pack complémentaire accompagne ce prompt. Après extraction à la racine du projet, il fournit :
- public/videos/abfastcar-film.mp4 : version horizontale 1080p en H.264/AAC.
- public/videos/abfastcar-film-mobile.mp4 : variante horizontale 720p.
- public/videos/abfastcar-film-poster.webp : couverture extraite du film.
- public/videos/abfastcar-showroom.mp4 : version verticale 720 × 1280 en H.264/AAC.
- public/videos/abfastcar-showroom-poster.webp : couverture extraite de la vidéo verticale.
- docs/client/conditions-location-client-fr.txt : texte intégral du client.
- docs/client/medias-prepares.md : tailles, durées et contrôles des fichiers.
- ABFASTCAR-INTEGRATION.md : ce prompt avec le texte intégral en annexe.

Vérifie la présence et la qualité de ces fichiers. Réutilise les versions préparées lorsqu’elles conviennent ; si le pack n’a pas été extrait, retrouve les originaux et génère des équivalents optimisés. Ne prétends pas qu’un fichier est absent sans inspecter le dossier public. Dans le navigateur, les chemins commencent par /videos/, sans le préfixe /public/.

## 1. Emplacement et composition des vidéos

Ajoute sur l’accueil une section « L’univers AB FAST CAR », immédiatement après la présentation de la flotte et avant les étapes de réservation. Elle doit valoriser les véhicules et l’ambiance avant d’accompagner le visiteur vers une demande de location. Si les sections actuelles portent d’autres noms, conserve cette logique de placement.

Sur ordinateur :
- Composer une grande carte horizontale pour le film et une carte verticale plus étroite pour les coulisses.
- Préserver le ratio réel de chaque vidéo, les logos et les cadrages. Ne pas étirer ou recadrer agressivement les images pour forcer deux cartes identiques.
- Garder une largeur et une hauteur raisonnables pour la carte verticale, avec un espacement et des légendes alignés.

Sur mobile :
- Empiler les cartes ; garder le film horizontal et la seconde vidéo verticale.
- Limiter la taille du portrait pour éviter une section disproportionnée.
- Aucun défilement horizontal, chevauchement avec la barre Réserver ou élément important hors écran.

Style :
- Fonds noirs/anthracite, textes blancs/gris, bordures fines et arrondis cohérents avec le site.
- Couvertures nettes, boutons de lecture blancs ou gris, titres lisibles et animation discrète.
- Réserver le rouge aux actions de réservation. Ne pas ajouter de jaune, de halos lourds, de flous coûteux ni de compteurs ou avis inventés.
- Titres proposés : « L’expérience AB FAST CAR » pour IMG_0051.MOV et « Dans les coulisses » pour IMG_0053.MOV.
- Une phrase d’introduction courte et factuelle suffit. Ne pas affirmer que le lieu filmé est l’agence de Marrakech si cette information n’est pas confirmée.

Préserver le premier écran actuel : cette section complète la page, sans transformer le hero en fond vidéo.

## 2. Lecture et accessibilité

Les cartes affichent d’abord uniquement une couverture et un bouton de lecture avec un nom accessible. Au clic, ouvrir un lecteur dans une modale adaptée au format, avec commandes natives, volume et plein écran.

- Créer le lecteur et affecter sa source seulement après l’action de l’utilisateur.
- Aucune lecture ni piste sonore au chargement de la page ou au survol.
- Utiliser playsInline et un préchargement limité ; le chargement différé ne doit pas dépendre uniquement d’un attribut que certains navigateurs peuvent ignorer.
- Une seule vidéo joue à la fois. Fermer la modale arrête la lecture et libère la source.
- Gérer Échap, retour du focus au bouton d’origine, focus contenu dans la modale et défilement de l’arrière-plan.
- Prévoir un état de chargement, une erreur compréhensible et un moyen de réessayer.
- Choisir la variante 720p du film sur petit écran au moment du lancement ; ne pas télécharger les deux variantes.
- Préserver la piste sonore du client, sous le contrôle du visiteur. S’il y a des paroles ou informations essentielles dans l’audio, prévoir des sous-titres fidèles ; ne pas inventer de transcription.
- Respecter prefers-reduced-motion.

Les titres, légendes, boutons et messages doivent exister en français, anglais, néerlandais et arabe avec RTL correct.

## 3. Performance à préserver

Cette intégration arrive pendant une optimisation mobile déjà en cours. Les derniers chiffres communiqués étaient 73/100 sur mobile et 99/100 sur ordinateur ; ils ne mesurent pas encore cette intégration.

- Aucun téléchargement MP4 ou MOV avant un clic sur Lecture, y compris après simple défilement jusqu’à la section.
- Charger les couvertures sous le premier écran de façon différée, avec dimensions/ratio réservés pour éviter les décalages.
- Ne pas importer une bibliothèque vidéo lourde.
- Conserver le lecteur et le code admin hors du JavaScript initial lorsque c’est possible.
- Vérifier les URL, types MIME, lecture Safari/iPhone et Chrome/Android lorsque les environnements sont disponibles, ainsi que la recherche dans la vidéo et la lecture audio.
- Vérifier dans l’onglet Réseau qu’une seule source vidéo est demandée au lancement et qu’aucune source originale .MOV n’est appelée par le site.
- Conserver les autres optimisations de performance. Les tests Lighthouse finaux doivent porter sur le build réellement livré, sans autre build concurrent.
- Comparer avant/après avec les mêmes réglages et la médiane de 3 exécutions. Rapporter Performance, LCP, Speed Index, TBT, CLS et requêtes vidéo avant clic. Ne pas attribuer un résultat à un test non effectué.
- Objectifs maintenus : mobile ≥ 90, LCP ≤ 2,5 s et Speed Index ≤ 3,4 s, sans régression desktop. Si un objectif reste manqué, expliquer la cause résiduelle mesurée.

## 4. Page des conditions de location

Le texte complet fourni par le client figure dans l’annexe de ce prompt et dans docs/client/conditions-location-client-fr.txt.

Créer une vraie page « Conditions de location », accessible directement par URL et disponible dans le HTML initial. Suivre les conventions des routes existantes, avec une URL cohérente par langue. Réutiliser une page équivalente si elle existe déjà plutôt que créer un doublon.

Mise en page :
- Un H1, une introduction sobre et un sommaire des 16 articles avec ancres.
- Des articles numérotés, des sous-titres lisibles, une largeur de lecture confortable et un bon contraste.
- Sur ordinateur, sommaire latéral fixe si utile ; sur mobile, sommaire compact et contenu sans débordement.
- Tout le texte doit rester accessible sans devoir ouvrir une succession de modales ou charger du JavaScript. Un accordéon peut compléter la navigation, sans rendre les articles introuvables.
- Prévoir un style d’impression propre.

Placer un lien « Conditions de location » dans le footer de toutes les langues et un lien visible près de l’envoi de la demande de réservation. Conserver le fonctionnement WhatsApp et le fait qu’une demande n’est confirmée qu’après la réponse de l’agence. Ne pas inventer une signature ou une acceptation contractuelle à partir d’un simple clic de consultation.

Fidélité au texte :
- Conserver intégralement les 16 articles et les réserves du client. Corriger la présentation, sans réécrire les obligations, montants, pourcentages ou exceptions.
- La franchise de 5 % de la valeur du véhicule est celle décrite à l’article 4, dans ses conditions précises. Ne pas la présenter comme une caution générale.
- Les 150 MAD de lavage sont conditionnels à l’état de restitution décrit à l’article 11. Ne pas les ajouter automatiquement au prix de chaque location.
- Ne pas inventer de caution fixe, âge minimum, liste de documents client, kilométrage illimité, annulation gratuite ou délai de remboursement.
- Mettre à jour la FAQ avec les seules informations désormais confirmées par ce document ; garder une invitation à contacter l’agence lorsque le détail dépend du contrat.
- Vérifier les éventuelles promesses existantes sur le site qui contrediraient le document et les signaler ou les reformuler fidèlement à la source.

Point concret à faire confirmer au client : l’article 10 désigne les tribunaux de Rabat, alors que l’adresse de l’agence est désormais Marrakech. Une adresse et une juridiction sont deux informations différentes : ne remplace surtout pas Rabat par Marrakech automatiquement dans cette clause. Préserver la formulation fournie en attendant une instruction précise du client. Ce point ne bloque pas l’intégration du reste.

Prévoir les versions EN, NL et AR en restant fidèle au français fourni ; conserver les valeurs numériques, exceptions et réserves. Identifier la version française comme texte source sans ajouter une clause « seule version faisant foi » qui ne figure pas dans le document. Ne pas inventer une date d’entrée en vigueur ni prétendre avoir validé juridiquement le texte.

## 5. SEO, langues et administration existante

- Ajouter des titres, descriptions et canonical cohérents à la page des conditions, avec hreflang réciproques.
- Mettre à jour le sitemap et les contrôles de routes avec le nombre réellement attendu ; ne pas conserver artificiellement une limite de 100 URL si de nouvelles pages sont ajoutées.
- Ajouter les conditions au maillage interne et à l’index documentaire llms.txt.
- Préserver noindex pour les environnements de test et le fonctionnement indexable de la production.
- Pour les vidéos, ne créer des données structurées que si les champs nécessaires sont réels et disponibles. Ne pas inventer de date de publication, de popularité ou de résultat enrichi.

Raccorder simplement ces nouveaux contenus à l’admin existant :
- Titres/légendes des vidéos par langue, source MP4, couverture, ordre et visibilité.
- Contenu des conditions par langue, en conservant le texte client initial comme référence.
- Réutiliser l’authentification, la validation et la persistance existantes. Un champ URL validé vers les médias préparés suffit pour cette livraison ; pas besoin de construire une plateforme de transcodage vidéo.
- Ne pas envoyer une vidéo dans le traitement d’images sharp. Si l’upload vidéo n’existe pas encore, ne pas le présenter comme fonctionnel.
- Vérifier qu’une sauvegarde apparaît sur le site dans une autre session et qu’elle ne dépend pas de localStorage.

## 6. Livrer une intégration vérifiée

Après intégration, exécuter TypeScript, le build de production et les contrôles pertinents. Vérifier :
- les 2 vidéos avec leurs bons titres, ratios, audio et commandes ;
- zéro requête vidéo avant lecture et arrêt à la fermeture ;
- mobile et desktop, les 4 langues et le RTL ;
- les 16 articles complets, liens du footer/formulaire, ancres, sitemap et hreflang ;
- la cohérence du parcours de réservation et l’absence de régression des prix ;
- la sauvegarde des nouveaux champs admin, ou le blocage exact si un accès de stockage manque.

Ne pas envoyer de vrai message WhatsApp pendant les essais. Ne pas publier en production sans autorisation existante. Fournir les fichiers modifiés, des captures desktop/mobile, les mesures avant/après et les limites réelles. Séparer ce qui est effectivement testé de ce qui reste à vérifier.

Références techniques officielles :
- https://web.dev/articles/lazy-loading-video
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video

## Annexe — texte français intégral fourni par le client

Le bloc suivant est la source à reproduire fidèlement ; les demandes d’intégration se trouvent au-dessus.


```text
AB FAST CAR

CONDITIONS GÉNÉRALES DE LOCATION DE VÉHICULES

ARTICLE 1 – ÉTAT DU VÉHICULE

La société AB Fast Car s’engage à remettre au client un véhicule propre, lavé et en bon état de fonctionnement.

Le client s’engage à restituer le véhicule dans le même état général que celui dans lequel il l’a reçu, sous réserve de l’usure normale liée à une utilisation conforme aux conditions de location.

À défaut, les frais de remise en état pourront être facturés au client, sur la base des dommages constatés et des frais justifiés.

Les pneus du véhicule sont en bon état au départ. En cas de détérioration d’un pneu pour une cause autre que l’usure normale, ou en cas de disparition de l’un d’entre eux, les frais de remplacement pourront être facturés au client lorsque sa responsabilité est établie. Le remplacement devra respecter les dimensions, les caractéristiques et les exigences de sécurité du véhicule.

ARTICLE 2 – USURE MÉCANIQUE ET RÉPARATIONS

L’usure mécanique normale du véhicule est à la charge de la société AB Fast Car.

Les réparations rendues nécessaires par une utilisation anormale du véhicule, une négligence du client, un accident ou toute autre cause imputable au client seront à la charge de ce dernier, dans les limites prévues par le contrat de location et la réglementation applicable.

Une indemnité d’immobilisation pourra être réclamée lorsque les conditions contractuelles et les circonstances le justifient, sur la base d’éléments permettant d’en établir le montant.

ARTICLE 3 – UTILISATION DU VÉHICULE

La location est personnelle et ne peut être transférée à un tiers sans l’accord préalable de la société AB Fast Car.

Le client s’engage à ne confier la conduite du véhicule qu’aux personnes autorisées et mentionnées dans le contrat de location.

Le client doit utiliser le véhicule conformément à sa destination, aux règles de sécurité routière et aux conditions prévues dans le contrat.

ARTICLE 4 – ASSURANCE, RESPONSABILITÉ ET FRANCHISE

Le véhicule est couvert par les garanties d’assurance souscrites par la société AB Fast Car, conformément aux conditions, limites, exclusions et franchises prévues par la police d’assurance applicable.

Les garanties relatives à la responsabilité civile, au vol, à l’incendie et aux dommages au véhicule sont celles prévues au contrat d’assurance.

Les accessoires, vêtements, effets personnels et autres objets oubliés à l’intérieur du véhicule ou dans le coffre ne sont pas couverts par les garanties de la société AB Fast Car, sauf disposition contraire applicable.

Le nombre de personnes transportées dans le véhicule ne doit pas dépasser le nombre de places autorisées.

Franchise d’assurance en cas d’accident responsable

En cas d’accident impliquant le véhicule loué, lorsque la responsabilité du client est établie, totalement ou partiellement, le client s’engage à verser à la société AB Fast Car une franchise correspondant à 5 % de la valeur du véhicule, selon la base de calcul définie dans le contrat de location et sous réserve des conditions de la police d’assurance applicable.

En cas de responsabilité partagée, les modalités de prise en charge seront déterminées conformément aux règles applicables et aux conditions du contrat d’assurance.

La franchise ne pourra être réclamée au client que dans les limites de sa responsabilité et des dispositions contractuelles et assurantielles applicables.

Déclaration d’un accident

En cas d’accident, de vol ou d’incendie, le client doit informer la société AB Fast Car dans les meilleurs délais et effectuer les démarches nécessaires auprès des autorités compétentes et de l’assureur.

Le client devra fournir une déclaration détaillée précisant notamment les circonstances de l’événement, le lieu, la date, l’heure et, dans la mesure du possible, les coordonnées des témoins.

Un constat amiable ou un procès-verbal établi par les autorités compétentes devra être fourni lorsque cela est nécessaire.

ARTICLE 5 – TARIFS, CAUTION ET PROLONGATION DE LOCATION

Le montant de la location et celui de la caution sont déterminés conformément aux tarifs communiqués au client et figurant dans son contrat de location.

Le paiement de la location s’effectue selon les modalités convenues avant la remise du véhicule.

La caution ne peut pas être utilisée automatiquement pour régler une prolongation de location.

Si le client souhaite conserver le véhicule au-delà de la durée initialement prévue, il doit obtenir l’accord préalable de la société AB Fast Car et régler le montant correspondant à la période supplémentaire selon les modalités convenues.

Toute prolongation doit être expressément acceptée par la société AB Fast Car.

À défaut d’accord, le client doit restituer le véhicule à la date et à l’heure prévues au contrat. Tout maintien du véhicule sans autorisation pourra donner lieu aux démarches prévues par la réglementation applicable.

La restitution de la caution intervient conformément aux modalités prévues au contrat, sous réserve des sommes justifiées restant éventuellement dues par le client.

ARTICLE 6 – DOCUMENTS ET ACCESSOIRES DU VÉHICULE

Lors de la restitution du véhicule, le client doit remettre à la société AB Fast Car tous les documents, clés et accessoires qui lui ont été confiés lors de la prise en charge.

En cas de document, de clé ou d’accessoire manquant, le client devra en informer immédiatement la société.

Les éventuels frais de remplacement pourront être facturés au client lorsque sa responsabilité est établie et que les frais sont justifiés.

ARTICLE 7 – AMENDES, CONTRAVENTIONS ET INFRACTIONS

Le client est responsable des infractions, amendes, contraventions et frais légalement imputables à son utilisation du véhicule pendant la période de location.

Il s’engage à respecter le Code de la route ainsi que l’ensemble des règles applicables à la circulation et au stationnement.

Les sommes dues au titre des infractions commises pendant la période de location pourront être réclamées au client conformément à la réglementation applicable.

ARTICLE 8 – ANNULATION, INTERRUPTION ET REMBOURSEMENT

Les conditions d’annulation, d’interruption anticipée et de remboursement sont celles communiquées au client avant la confirmation de sa réservation et précisées dans son contrat de location.

En cas d’interruption anticipée de la location par le client, le remboursement des sommes éventuellement versées sera déterminé conformément aux conditions contractuelles applicables et à la réglementation en vigueur.

Les éventuels frais d’annulation ou sommes non remboursables doivent être prévus dans les conditions communiquées au client et respecter la réglementation applicable.

ARTICLE 9 – UTILISATION DU VÉHICULE HORS DU MAROC ET UTILISATION INTERDITE

Le véhicule ne peut être conduit en dehors du territoire marocain sans l’autorisation préalable et écrite de la société AB Fast Car et sans vérification des autorisations et garanties d’assurance nécessaires.

Toute utilisation du véhicule contraire au contrat, à la réglementation applicable ou aux conditions de l’assurance peut engager la responsabilité du client dans les limites prévues par la loi.

La société AB Fast Car ne saurait être tenue responsable des conséquences d’une utilisation non autorisée ou illégale du véhicule, sous réserve des obligations légales qui lui incombent.

ARTICLE 10 – LITIGES ET JURIDICTION COMPÉTENTE

En cas de désaccord relatif à l’exécution du présent contrat, les tribunaux de la ville de Rabat seront seuls compétents, sous réserve des règles impératives de compétence prévues par la réglementation applicable.

ARTICLE 11 – PROPRETÉ DU VÉHICULE ET FRAIS DE LAVAGE

La société AB Fast Car s’engage à remettre au client un véhicule propre et lavé au moment de la prise en charge.

Le client s’engage à restituer le véhicule propre, dans un état de propreté équivalent à celui constaté lors de sa remise.

Si le véhicule est restitué sale et nécessite un lavage complet, des frais forfaitaires de nettoyage de 150 dirhams marocains (MAD) seront facturés au client.

Ces frais correspondent au lavage complet du véhicule. Ils ne couvrent pas les éventuels frais supplémentaires de nettoyage spécialisé qui pourraient être nécessaires en cas de salissures exceptionnelles, sous réserve de leur justification et des conditions contractuelles applicables.

ARTICLE 12 – ÉTAT DES LIEUX DU VÉHICULE

Un état des lieux du véhicule peut être établi au départ et au retour, en présence du client ou de son représentant.

Cet état des lieux peut comprendre des photographies permettant de constater l’état extérieur et intérieur du véhicule, le niveau de carburant, le kilométrage, ainsi que la présence des documents et accessoires remis au client.

Le client est invité à signaler toute anomalie ou tout dommage visible avant de prendre possession du véhicule.

En cas de dommage constaté lors de la restitution, la société AB Fast Car pourra établir un relevé des dommages et communiquer au client les éléments justificatifs correspondants.

ARTICLE 13 – RESTITUTION DU VÉHICULE ET RETARD

Le client s’engage à restituer le véhicule à la date, à l’heure et au lieu convenus dans le contrat de location.

Toute demande de prolongation doit être communiquée à la société AB Fast Car et acceptée préalablement.

En cas de retard non autorisé, des frais supplémentaires pourront être appliqués conformément au tarif communiqué au client et aux conditions prévues au contrat.

Le client doit restituer le véhicule avec les clés, les documents et les accessoires remis lors de la prise en charge.

ARTICLE 14 – CARBURANT ET KILOMÉTRAGE

Le niveau de carburant et les conditions de kilométrage applicables sont ceux précisés dans le contrat de location.

Sauf accord contraire, le client s’engage à restituer le véhicule avec un niveau de carburant équivalent à celui constaté au départ.

Tout carburant manquant ou tout dépassement de kilométrage pourra être facturé conformément aux tarifs communiqués au client avant la location.

ARTICLE 15 – ENTRETIEN ET UTILISATION DU VÉHICULE

Le client s’engage à utiliser le véhicule avec soin, conformément à sa destination et aux règles de sécurité routière.

Il est interdit d’utiliser le véhicule pour une activité illégale, une compétition automobile, un transport non autorisé ou toute autre utilisation contraire au contrat ou aux conditions d’assurance.

Le client doit signaler sans délai à la société AB Fast Car toute panne, anomalie mécanique, voyant d’alerte ou situation susceptible de compromettre la sécurité du véhicule.

Aucune réparation importante ne doit être entreprise sans l’accord préalable de la société, sauf mesure urgente nécessaire à la sécurité des personnes.

ARTICLE 16 – ACCEPTATION DES CONDITIONS GÉNÉRALES

La réservation et la prise en charge du véhicule impliquent la reconnaissance par le client des conditions de location qui lui ont été communiquées et qu’il a acceptées conformément aux modalités prévues au contrat.

Les conditions particulières mentionnées dans le contrat de location complètent les présentes conditions générales.

En cas de contradiction, les dispositions impératives de la réglementation applicable prévalent.

La société AB Fast Car recommande au client de lire attentivement l’ensemble des conditions avant de confirmer sa réservation.
```

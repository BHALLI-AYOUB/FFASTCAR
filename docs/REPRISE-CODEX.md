# Reprise Codex — 29 octobre 2026

Branche `feat/client-feedback`, travail local antérieur préservé, exactement trois agents. Aucun paquet installé, original vidéo modifié, secret publié ou message WhatsApp envoyé. Aucun déploiement.

## Terminé

- Vidéos : cause du `#videos` absent identifiée (ancien build/serveur), lecture différée, choix mobile, erreur/réessai, focus/Échap/défilement et 4 langues contrôlés.
- Conditions : FR intact (SHA-256 attendu), EN/NL/AR, 16 articles/63 paragraphes, pages SSR, liens footer/réservation, SEO, sitemap 104 URL/llms, RTL et impression.
- Admin : vidéos/conditions, sauvegarde inter-session, ajout véhicule 200 puis masqué/supprimé 404, accès 401/403/conflit 409. Migration strictement limitée aux anciens textes standard, réponses personnalisées préservées. Données d’essai restaurées exactement (`.data/site-content.json` absent).
- Build stabilisé `.next-perf`, ID `xQmby86mMz8qdTQJedPoH`, serveur neuf **3211**. **Ne pas tester 3100**, ancien serveur occupé. TypeScript/build/source HTML réussis ; 22 contrôles API, 114 contrôles de routes et 55 contrôles navigateur des conditions réussis. ESLint absent : lint non validé.
- CSS externe retenu ; aucune erreur TypeScript ignorée au build. Captures revues dans `reports/integration/final-captures/` et `final-conditions/`.

## En cours / restant

Campagne finale Lighthouse sur ce seul build : 4 scénarios × 3 passages × 2 protocoles séparés, sans compilation/navigation concurrente. Compléter les résultats après sa fin. Rapports historiques conservés ; l’ancien 73/100 n’est pas un résultat final.

Campagne active dans `reports/perf/codex-final/` : les 12 passages simulés sont terminés, DevTools en cours. Premier résultat FR mobile simulé : médiane 81, LCP 3,99 s, SI 4,75 s (objectifs manqués) ; desktop 99, LCP 0,77 s. **Après fermeture de Lighthouse**, vérifier les polices avec `node scripts/perf/check-fonts.mjs http://localhost:3211 reports/perf/font-diagnostic` : suspicion d’alias CSS définis sur `:root` alors que les variables next/font sont sur `body`. Ne pas conclure sans computed styles/CDP. Le script de smoke UI admin est prêt mais non exécuté ; la demande d’élévation du sous-agent a été interrompue avant lancement de Chrome.

```powershell
$env:NEXT_DIST_DIR='.next-perf'
pnpm start --port 3211
node scripts/check-admin-integration.mjs --base=http://localhost:3211
node scripts/check-public-routes.mjs http://localhost:3211
node scripts/check-integration.mjs --base=http://localhost:3211 --out=reports/integration/nouvelle-verification
node scripts/check-conditions-browser.mjs --base=http://localhost:3211 --out=reports/integration/nouvelles-conditions
node scripts/perf/run.mjs --base=http://localhost:3211 --dist=.next-perf --out=reports/perf/nouvelle-campagne
```

## Suite externe

- Vercel : CLI sans identifiants, checkout non lié ; connecteur en lecture accessible mais aucun projet confirmé pour `abfastcar.com`. Exécuter interactivement `vercel login`, `vercel link`, choisir le bon compte/projet puis `vercel project inspect --non-interactive`. Configurer Blob+admin sur Preview dans le tableau de bord, déployer une preview et vérifier sauvegarde/invalidation. Pas de secret dans le chat ; production seulement après autorisation.
- Rabat article 10 conservé, à faire confirmer au client malgré l’agence à Marrakech. Safari/iPhone et Android physiques, écoute humaine et besoin de sous-titres restent à vérifier. Blob en ligne non testé.

Rapport détaillé : [RAPPORT-INTEGRATION-CODEX.md](RAPPORT-INTEGRATION-CODEX.md). Espace libre constaté après build : environ 3,1 Gio ; éviter les builds inutiles.

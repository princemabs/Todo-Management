# Next-Gen Personal Productivity Dashboard

Application web React (Vite) + API Express pour planifier jour / semaine / mois / année, avec thème futuriste Blue Brand et persistance dans `data/planner.json`.

## Prérequis

- Node.js 18+

## Installation

```bash
npm run install:all
```

Copiez `server/.env.example` vers `server/.env` et ajustez si besoin (`SESSION_SECRET`, `CLIENT_ORIGIN`).

## Lancement

```bash
npm run dev
```

- Frontend : [http://localhost:5173](http://localhost:5173)
- API : [http://localhost:3001](http://localhost:3001) (proxy `/api` via Vite)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard (lecture seule ou édition si connecté) |
| `/today` | Vue publique read-only du planning du jour |

## Mode éditeur

Bouton **Mode éditeur / Connexion** en haut à droite. Les identifiants sont validés **côté serveur** (`server/src/config/auth.js` ou variables `EDITOR_USERNAME` / `EDITOR_PASSWORD`).

Les visiteurs peuvent consulter le dashboard et `/today` sans pouvoir créer, modifier ou supprimer des tâches.

## Données

Toutes les tâches sont enregistrées dans [`data/planner.json`](data/planner.json) à chaque action API.

## Structure

- `client/` — React, Tailwind, Framer Motion, palette [`client/src/theme/colors.js`](client/src/theme/colors.js)
- `server/` — Express, auth session cookie, routes REST
- `data/` — Fichier JSON persistant

## Hébergement (Vercel + Render)

Guide pas à pas : [**docs/DEPLOY-VERCEL-RENDER.md**](docs/DEPLOY-VERCEL-RENDER.md)

- **Vercel** : dossier `client`, variable `VITE_API_URL=https://ton-api.onrender.com`
- **Render** : dossier `server`, disque persistant + `PLANNER_DATA_PATH`, `CLIENT_ORIGIN`, `CROSS_ORIGIN=true`

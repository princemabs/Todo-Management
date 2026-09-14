# Déploiement : Vercel (front) + Render (back)

Architecture : le React appelle l’API Render via `VITE_API_URL`. Les cookies du mode éditeur passent en **cross-site** (`CROSS_ORIGIN=true`).

---

## Partie 1 — Backend sur Render

### 1. Préparer le repo

Pousse le projet sur **GitHub** (ou GitLab).

### 2. Créer le Web Service

1. [render.com](https://render.com) → **New** → **Web Service**
2. Connecte le repo **Todo-Management**
3. Paramètres :

| Champ | Valeur |
|--------|--------|
| **Name** | `todo-planner-api` (exemple) |
| **Region** | proche de toi (ex. Frankfurt) |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node src/index.js` |
| **Instance type** | Free ou paid |

### 3. Stockage des données (2 options)

#### Option A — Plan free (sans disque)

- **Ne définis pas** `PLANNER_DATA_PATH`.
- Fichier live : `server/data/planner.json` sur le serveur (JSON, pas de base de données).
- Sauvegarde automatique : `planner.json.bak` à chaque écriture.
- **Limite Render :** à chaque **redéploiement**, le disque éphémère peut être réinitialisé → tâches perdues si tu n’as pas de disque.

#### Option B — Disque persistant (recommandé)

1. **Disks** → Add disk → mount **`/var/data`**
2. Redéploie le service
3. Le serveur détecte `/var/data` automatiquement **ou** tu mets `PLANNER_DATA_PATH=/var/data/planner.json`

> Ne mets `PLANNER_DATA_PATH=/var/data/...` **sans** disque monté (erreur EACCES).

#### Vérifier les données après deploy

```text
GET https://TON-API.onrender.com/api/data-info
```

→ `taskCount`, `path`, `meta` (confirme où sont stockées les tâches).

### 4. Variables d’environnement (Render)

Dans **Environment** :

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | longue chaîne aléatoire (32+ caractères) |
| `CLIENT_ORIGIN` | `https://TON-PROJET.vercel.app` (URL exacte du front) |
| `CROSS_ORIGIN` | `true` |
| `EDITOR_USERNAME` | ton identifiant éditeur |
| `EDITOR_PASSWORD` | mot de passe fort |
| `PLANNER_DATA_PATH` | *(Option B uniquement)* `/var/data/planner.json` |

5. **Save** → déploiement (ou **Manual Deploy**).

### 5. URL de l’API

Après déploiement, note l’URL Render, par ex. :

`https://todo-planner-api.onrender.com`

Test :

```text
https://todo-planner-api.onrender.com/api/health
```

→ `{"ok":true}`

**Plan free Render :** le service **s’endort** après inactivité ; le premier appel peut prendre ~30–60 s.

---

## Partie 2 — Frontend sur Vercel

### 1. Importer le projet

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Importe le **même repo**

### 2. Paramètres de build

| Champ | Valeur |
|--------|--------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

(`vercel.json` gère déjà les routes `/` et `/today`.)

### 3. Variable d’environnement (Vercel)

**Settings** → **Environment Variables** :

| Key | Value | Environments |
|-----|--------|----------------|
| `VITE_API_URL` | `https://todo-planner-api.onrender.com` | Production (et Preview si tu testes) |

Pas de `/` à la fin.

### 4. Déployer

**Deploy**. URL du type : `https://todo-management-xxx.vercel.app`

### 5. Mettre à jour Render

Retourne sur Render → `CLIENT_ORIGIN` = **exactement** l’URL Vercel (avec `https://`).

Si tu ajoutes un **domaine custom** sur Vercel, mets-le dans `CLIENT_ORIGIN` (plusieurs URLs : séparées par des **virgules**).

Redéploie le service Render après changement de `CLIENT_ORIGIN`.

---

## Partie 3 — Vérifications

1. Ouvre `https://TON-APP.vercel.app/today` → planning ou liste vide OK.
2. Ouvre le dashboard → tâches se chargent.
3. **Mode éditeur / Connexion** → login → crée une tâche.
4. Recharge : la tâche est toujours là (disque Render OK).

### Problèmes fréquents

| Symptôme | Cause probable | Action |
|----------|----------------|--------|
| Erreur CORS | `CLIENT_ORIGIN` ≠ URL Vercel | Corriger et redéployer Render |
| Login OK mais pas éditeur (surtout mobile) | Cookies cross-site bloqués | Redéployer front + back : login renvoie un **token** (`Authorization: Bearer`) stocké en localStorage |
| Login OK mais pas éditeur | Cookie bloqué | `CROSS_ORIGIN=true`, HTTPS partout |
| API lente au 1er hit | Render free sleep | Attendre ou plan payant |
| Données perdues | Pas de disk | Disk `/var/data` + `PLANNER_DATA_PATH` |

---

## Partie 4 — Domaine personnalisé (optionnel)

**Vercel** : Settings → Domains → `planner.tondomaine.com`

**Render** : pas obligatoire ; l’API peut rester en `*.onrender.com`.

Mettre à jour :

- Vercel : `VITE_API_URL` inchangé (URL Render)
- Render : `CLIENT_ORIGIN=https://planner.tondomaine.com`

---

## Développement local (inchangé)

```bash
npm run install:all
npm run dev
```

Ne définis **pas** `VITE_API_URL` en local : le proxy Vite envoie `/api` vers `localhost:3001`.

Pour simuler la prod en local :

```env
# client/.env.local
VITE_API_URL=http://localhost:3001
```

```env
# server/.env
CLIENT_ORIGIN=http://localhost:5173
CROSS_ORIGIN=false
```

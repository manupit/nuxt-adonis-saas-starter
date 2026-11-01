# Starter Kit — Nuxt 4 + AdonisJS

> A production-ready Nuxt 4 + AdonisJS starter for building SaaS applications.
>
> Authentication, users, sessions, database and a clean UI included. Focus on your product, not the boilerplate.

Stack volontairement simple : **Nuxt 4**, **Nuxt UI**, **AdonisJS 7**, **PostgreSQL**.

## Démarrage rapide

```bash
git clone https://github.com/manupit/nuxt-adonis-saas-starter.git
cd nuxt-adonis-saas-starter

cp backend/.env.example backend/.env
# Génère une APP_KEY :
cd backend && node ace generate:key && cd ..

# Ajuste DB_* dans backend/.env (hôte, user, password, DB_DATABASE)

# Optionnel : Postgres via Docker
# docker compose up -d

npm install
npm run migrate
npm run dev
```

Puis ouvre [http://localhost:3000](http://localhost:3000)

```text
Landing → Register / Login → Dashboard → Account
```

## Fonctionnalités

### Authentification
- Inscription (avec confirmation du mot de passe)
- Connexion / déconnexion
- Session cookie (via proxy Nuxt `/api` → Adonis)
- Routes protégées + pages guest

### Compte
- Mise à jour du profil
- Changement de mot de passe
- Suppression de compte

### Mot de passe oublié
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- En développement, le lien de reset est **loggé dans la console backend** (mailer console). Remplace `MailService` par Resend/SMTP quand tu es prêt.

### UI
- Layouts `auth` et `dashboard`
- Dark mode (light / dark)
- Design volontairement sobre (Nuxt UI)

## Structure

```text
STARTERKIT/
├── backend/          # AdonisJS API
│   ├── app/controllers/
│   ├── app/services/     # AuthService, MailService
│   ├── app/validators/
│   └── database/migrations/
├── frontend/         # Nuxt 4 + Nuxt UI
│   └── app/
│       ├── layouts/
│       ├── pages/auth/
│       ├── pages/dashboard/
│       └── composables/
└── docker-compose.yml    # PostgreSQL local (optionnel)
```

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| POST | `/api/auth/logout` | session |
| GET | `/api/auth/me` | session |
| POST | `/api/auth/forgot-password` | public |
| POST | `/api/auth/reset-password` | public |
| PATCH | `/api/account` | session |
| PUT | `/api/account/password` | session |
| DELETE | `/api/account` | session |

## Base de données

Par défaut : **PostgreSQL**. Le nom de la base est contrôlé par `DB_DATABASE` dans `backend/.env`.

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin
DB_DATABASE=adonisjs
```

Crée la base une fois (pgAdmin ou CLI) :

```bash
createdb -U postgres adonisjs
# ou : docker compose up -d  (base "starterkit" par défaut dans le compose)
```

Puis :

```bash
cd backend && node ace migration:run
```

SQLite reste disponible en fallback : passe `connection: 'sqlite'` dans `backend/config/database.ts`.

## Ce qui n'est PAS inclus (volontairement)

Stripe, orgs/teams, OAuth, 2FA, RBAC, S3, jobs, WebSockets…

Le starter reste : **clone → configure → code ton SaaS**.

## Roadmap

- [x] v0.1 — Foundation (Nuxt 4, Adonis, UI, layouts)
- [x] v0.2 — Authentication (register, login, logout, session)
- [x] v0.3 — Account (forgot/reset, change password, delete)
- [ ] v0.4 — Emails (Resend, templates, email verification)
- [ ] v0.5 — Production (CORS prod, rate limit, logging)
- [ ] v0.6 — SaaS extras (Stripe, OAuth, orgs…)

## Licence

MIT

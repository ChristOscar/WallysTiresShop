# Wally's Tires Shop — Full Stack Web App

A production-ready web application for **Wally's Tires Shop Hablamos Español**, a real Mexican-owned tire shop located at 6960 TX-276, Royse City, TX 75189.

## What's Inside

| Part | Description |
|------|-------------|
| **Marketing Site** | Public-facing landing page optimized for local search — bilingual (EN/ES), warm and community-focused |
| **Inventory Dashboard** | Mobile-first staff dashboard for tracking tire stock, locked behind a PIN |

---

## Tech Stack

- **Frontend**: Vite + React (JavaScript)
- **Backend**: Express.js REST API
- **Database**: SQLite via `better-sqlite3` (local dev) — structured to swap to Postgres on Railway
- **Styling**: Plain CSS with CSS variables, no frameworks
- **Deployment**: Backend → Railway · Frontend → Cloudflare Pages

---

## Running Locally

### 1. Install dependencies

```bash
# From the project root
npm run install:all
```

This installs root deps (concurrently), server deps, and client deps in one shot.

### 2. Seed the database

```bash
npm run seed
```

This creates `server/db/tires.db` and populates it with ~40 realistic tire entries.

### 3. Start both servers

```bash
npm run dev
```

This runs both the Express API (port 3001) and the Vite dev server (port 5173) concurrently.

- **Marketing site**: http://localhost:5173
- **Staff dashboard**: http://localhost:5173/inventory
- **API**: http://localhost:3001/api/tires

---

## Environment Variables

**`server/.env`**
```
PORT=3001
STAFF_PIN=1234
DATABASE_PATH=./db/tires.db
```

**`client/.env`**
```
VITE_API_URL=http://localhost:3001
```

### Changing the Staff PIN

Edit `STAFF_PIN` in `server/.env`. The PIN is checked server-side on every login attempt.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tires` | List all tires (supports `?brand=`, `?rimSize=`, `?width=`, `?search=`) |
| `POST` | `/api/tires` | Add a new tire |
| `PATCH` | `/api/tires/:id` | Update tire fields (price, quantity, etc.) |
| `DELETE` | `/api/tires/:id` | Delete a tire |
| `POST` | `/api/tires/:id/stock` | Quick stock adjust `{ action: "add" \| "remove", amount: 1 }` |
| `POST` | `/api/auth` | Verify staff PIN `{ pin: "1234" }` |

---

## Deployment

### Backend → Railway

1. Push `server/` contents (or the full repo) to GitHub
2. Create a new Railway project → Deploy from GitHub
3. Set environment variables in Railway dashboard:
   - `PORT=3001`
   - `STAFF_PIN=your-secure-pin`
   - `DATABASE_PATH=./db/tires.db`
4. Railway will auto-detect the Node app and run `node index.js`

**To use Postgres on Railway:**
- Install `pg` package
- Replace `better-sqlite3` queries with `pg` pool queries (schema is the same)
- Set `DATABASE_URL` from Railway's Postgres plugin

### Frontend → Cloudflare Pages

1. Push `client/` to GitHub
2. In Cloudflare Pages: New Project → Connect GitHub repo
3. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = your Railway backend URL (e.g. `https://wallys-tires.up.railway.app`)
5. Deploy — Cloudflare handles CDN globally

---

## Pages & Features

### Marketing Site (`/`)
- **Hero** with shop name, bilingual tagline, call/directions CTAs, hours badge
- **Services** grid: 6 service cards
- **Brands** grid: 15 major tire brands
- **Why Choose Us**: 3-column with Hablamos Español, Community Roots, Fair Prices
- **Reviews**: 3 authentic-feeling Google-style reviews
- **Footer**: Address, hours, phone, Google Maps link

### Staff Dashboard (`/inventory`)
- PIN login at `/login` (stored in `localStorage` as `wallys_auth`)
- Sticky top bar + sticky filter bar
- Filters: search, brand, width, rim size, in-stock toggle
- Tire cards with brand, size, type, condition, quantity badge, price, and quick +/− stock buttons
- Add Tire modal with full form
- Delete with confirmation

---

## Screenshot Descriptions

**Marketing Page**
Deep red/black hero with "Your Community Tire Shop / Tu Taller de Confianza" headline, prominent phone CTA, and hours badges. Scrolls into services grid, brand cards, 3-column why-us section, review cards, and contact/hours info.

**Inventory Dashboard**
Mobile-first (max 480px). Sticky header with shop name and "+ Add Tire" button. Sticky filter bar below. Scrollable list of tire cards showing brand name large, tire size (e.g. 265/70R17), type, condition, quantity badge (green/yellow/red), price, and +/− stock action buttons. Tapping "+ Add Tire" slides up a bottom sheet modal form.

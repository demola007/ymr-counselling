# YMR Counselling · City Takers 2026

The public site and staff portal for the Counselling & Follow-up team of Young Ministers Retreat (10th edition, Dec 26–30, 2026, Old Auditorium, Redemption City of God).

- **Public site**: landing page, "Book counselling" (counsellee), "I gave my life to Jesus" (convert) and "Join the team" (counsellor application) wizards.
- **Staff portal** (`/portal`): AI form capture, converts pipeline, counsellee triage and smart matching, counselling team, analytics, notifications (send, history, delivery tracking), exports, activity log, access & roles, editions.
- **Editions**: every record belongs to a YMR year. The portal's edition switcher shows 2024, 2025 and 2026 today; adding a year in `src/config/editions.ts` (and the `editions` table) is all a new December needs.

## Run it

```bash
cp .env.example .env
docker compose up -d --build
```

- Web (Vite, hot reload): http://localhost:8080
- Postgres 16: `localhost:5433`. The schema in `db/init/001_schema.sql` loads on first start.
- Production-like build behind nginx: `docker compose --profile prod up -d web-prod` → http://localhost:8081

Without Docker: `npm install && npm run dev`.

### Demo accounts (mock mode)

The portal runs on an in-browser mock API until the FastAPI rebuild lands (`VITE_API_MODE=mock`). Demo logins for each role are in `src/auth/mockUsers.ts`, and the login page has one-click buttons for them in mock mode. Changes you make are kept in the browser. **Editions → Reset mock database** clears them.

## Roles

| | Counsellor (`user`) | Admin | Super admin |
|---|:-:|:-:|:-:|
| View converts, AI capture | ✓ | ✓ | ✓ |
| Edit converts & counsellees, team, analytics, notification history, exports | | ✓ | ✓ |
| Send notifications, edit templates, manage access & editions | | | ✓ |

The matrix lives in `src/auth/permissions.ts`. The API must enforce the same rules.

## Code map

```
src/
  config/       editions, site facts & ministers, messaging providers
  data/api.ts   the single data boundary (mock today, HTTP later)
  data/mock/    deterministic seed data + localStorage change-log
  data/analytics.ts  aggregations (mirror these in SQL on the API)
  auth/         session, permissions, route guard
  components/   brand (embers, skyline, nations burst), landing, portal kit, charts
  pages/public  Home, Counselling, NewBeliever, JoinTeam, Login/Signup
  pages/portal  Overview, Capture, Converts, Counsellees, Team, Analytics, Notifications, Exports, Admin
db/init/        target Postgres schema (editions, staff, converts, counsellees, timeline, notifications…)
```

## Assets

Brand marks, edition flyers and gallery photos come from ymrglobal.org. Minister portraits in `public/ministers/` were cropped from the City Takers flyer and are low resolution, so swap in proper headshots when they're available. Videos in `public/videos/` are carried over from 2025.

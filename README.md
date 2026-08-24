# Cixing Customer Hub

Internal customer/visit/quotation tracking system for **Cixing Bangladesh Ltd.**, built to replace scattered Excel files, WhatsApp threads, and notebooks with one shared source of truth — without changing how the sales team already works.

Full product spec: [`docs/PRD.md`](docs/PRD.md)

## Status

**Current stage:** V1 (MVP) frontend scaffold — app shell, navigation, and dashboards built with sample data. No live database connection yet.

- [x] App shell, navigation, login screen (UI only)
- [x] Sales & Management dashboards (sample data)
- [ ] Visit logging form
- [ ] Factory database + Factory 360 page
- [ ] Follow-up list
- [ ] Supabase connection (auth + real data)

See `docs/PRD.md` for the full V1–V4 roadmap.

## Tech stack

- Plain HTML / CSS / JavaScript — no build step, no framework
- [Supabase](https://supabase.com) — database, authentication, file storage (connected in a later step)
- Fonts: Space Grotesk (headings), IBM Plex Sans (body), IBM Plex Mono (data/serials) via Google Fonts
- Icons: [Tabler Icons](https://tabler.io/icons) via CDN

## Project structure

```
cixing-customer-hub/
├── public/               # Everything that gets deployed
│   ├── index.html        # Single-page app entry point
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js        # UI logic (will grow into multiple files as features land)
├── db/
│   └── 01_v1_schema.sql  # V1 database schema (run in Supabase SQL Editor)
├── docs/
│   └── PRD.md            # Full product requirements document
├── .gitignore
└── README.md
```

## Running it locally

No install, no build step. Any static file server works. From the project root:

```bash
cd public
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

(If you have Node installed, `npx serve public` works just as well.)

## Deploying

Once you're happy with a version, `public/` can be deployed as-is to any static host:

- **Netlify** — drag-and-drop the `public/` folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect this repo and set the **publish directory** to `public`
- **Cloudflare Pages** — connect this repo, build command: none, output directory: `public`

## Database setup (Supabase)

Not connected yet — this is the next step. When we get there:

1. Create a project at [supabase.com](https://supabase.com)
2. Run `db/01_v1_schema.sql` in the Supabase SQL Editor
3. Add `public/js/supabaseClient.js` with your project URL and anon key
4. Swap the sample data in `app.js` for real Supabase queries

## License

Internal tool — not for external distribution.

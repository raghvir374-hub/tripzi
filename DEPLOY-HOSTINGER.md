# Deploying Tripnz to Hostinger

This is a **Next.js 15 app with server-side API routes and a MongoDB backend**
(admin panel, driver panel, bookings, WhatsApp integration, PDF vouchers). It
is not a static site, so it needs a Hostinger plan that supports **Node.js
hosting** — this includes Hostinger's Business/Premium shared hosting (via
the Node.js Selector in hPanel), Cloud Hosting, and VPS plans. A plain
static/shared plan without Node.js will not run this app.

The repo is already configured the easy way: `next.config.js` has
`output: 'standalone'`, which makes Next.js bundle a minimal self-contained
server — exactly what Hostinger's Node.js hosting expects.

## 1. Set up MongoDB

Hostinger doesn't provide MongoDB itself, so use a hosted MongoDB (the free
tier of [MongoDB Atlas](https://www.mongodb.com/atlas) works fine). Create a
cluster, a database user, and allow network access from anywhere (`0.0.0.0/0`)
since Hostinger's outbound IP isn't fixed on shared/cloud plans. Copy the
connection string — you'll need it as `MONGO_URL` below.

## 2. Build locally

```bash
npm install
npm run build
```

This produces:
- `.next/standalone/` — the server + only the node_modules it actually needs
- `.next/static/` — static assets
- `public/` — public assets

## 3. Assemble the upload folder

Standalone output doesn't automatically include `.next/static` or `public/`,
so copy them in before uploading:

```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

Now `.next/standalone/` is the complete, self-contained app — that's the
folder you upload.

## 4. Upload to Hostinger

1. In **hPanel → Advanced → Node.js**, create a new application.
   - Node.js version: **18.18 or newer** (20.x recommended)
   - Application root: e.g. `tripnz`
   - Application startup file: `server.js`
2. Upload the contents of `.next/standalone/` into that application root
   (via File Manager, the Node.js app's upload option, or SFTP/Git deploy —
   whichever Hostinger offers on your plan).
3. In the Node.js app's **Environment Variables** section, add the variables
   from `.env.example` (`MONGO_URL`, `DB_NAME`, `NEXT_PUBLIC_BASE_URL`, and
   the WhatsApp ones if you use that feature).
4. Point your domain (`tripnz.co.nz` or a subdomain) at this Node.js
   application in hPanel.
5. Restart the app from the Node.js panel.

No `npm install` step is needed on the server — the standalone build already
includes the runtime dependencies it needs.

## 5. Verify

- Visit the domain — the homepage should load.
- Visit `/admin/login` and `/driver/login` to confirm the panels load and can
  reach the API.
- Make a test booking to confirm the MongoDB connection and (if configured)
  WhatsApp notifications work.

## Notes

- `DB_NAME` defaults to `tripnz` if not set, but it's best to set it
  explicitly.
- If you'd rather not manage a Node process at all, Vercel (built by the
  makers of Next.js) deploys this repo with zero config — worth keeping in
  mind if Hostinger's Node.js hosting ever feels limiting for this app.

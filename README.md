# PMP Study (IT) — pronto per https://alekdrum.github.io/PMP/

- Router: HashRouter (adatto a GitHub Pages)
- Vite base: `/PMP/`
- Asset con BASE_URL
- Simulatore con salvataggio progressi

## Avvio locale
npm install
npm run dev

## Build & Deploy (branch gh-pages)
npm run build
npx gh-pages -d dist -b gh-pages

Su GitHub → Settings → Pages → Source: `gh-pages`


## Deploy automatico con GitHub Actions (consigliato)
- Il workflow `.github/workflows/deploy.yml` pubblica automaticamente su GitHub Pages ad ogni push su `main`.
- Nessun build locale necessario.

**Passi:**
1) Carica *tutti* i file di questo progetto nel repo `alekdrum/PMP` sul branch `main`.
2) Vai su *Settings → Pages* e imposta **Build and deployment → Source → GitHub Actions**.
3) Fai un commit/push su `main` (anche solo un README). Il workflow farà `npm ci`, `npm run build`, e pubblicherà.
4) L'URL sarà: https://alekdrum.github.io/PMP/

# muzzy

Two Svelte apps:

- `public/` – the main site (SvelteKit, static). It builds into `docs/`, which GitHub Pages serves.
- `private/` – a separate Vite + Svelte app. It is **its own git repo** and is ignored here.
  It builds into one HTML file, gets encrypted (PBKDF2 + AES-GCM), and lands in
  `public/static/vault.json`. The `/private` page asks for the password and decrypts it in the browser.

## Build

```sh
./build.sh                         # asks for the password
MUZZY_PASSWORD=... ./build.sh      # or pass it in
```

To see the real built site locally (served by Python's static server):

```sh
./run.sh        # builds, then serves on http://localhost:8000
```

## Deploy

`build.sh` writes the finished site to `docs/`. Commit `docs/` (and `public/static/vault.json`) and push.
In the GitHub repo settings, set Pages → Source to "Deploy from a branch", branch `main`, folder `/docs`.
The build uses relative paths, so it works under `https://<user>.github.io/<repo>/` without any config.

## Develop

```sh
./run-dev.sh   # public on http://localhost:5173, private on http://localhost:5174
```

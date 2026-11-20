# kingyin3613.github.io

Hao Yin's research website: one continuous story told by a lattice of about 2,700 nodes that morphs, scene by scene, from railway ballast to wood cells, cracks, transport networks, X-ray diffraction rings, architected solids and a recurrent neural network. Three things on the page are live:

- **The lattice** is a real mass–spring network. Press and drag in the opening scene or the closing one to indent it.
- **The learning lab** trains a small gated recurrent network in a Web Worker on a plasticity model with noisy data. Visitors draw a strain history and compare the network with the physics.
- **The guide** ("Ask the lattice") answers questions about the research with Claude and moves the page to show what it is talking about. Selecting any passage gives a levelled explanation (the Lens).

Without a Claude endpoint the site still works: the guide and the Lens fall back to an offline mode that answers from the page itself.

## Layout

| Path | What it holds |
| --- | --- |
| `src/data/` | All content: narrative chapters, publications, career, glossary, starter questions. The page and the Claude worker both read these files. |
| `src/render/` | Build-time HTML rendering of the content (a Vite plugin injects it into `index.html`). |
| `src/engine/` | The lattice: layout generators, scene blending, mass–spring indentation, WebGL2 renderer with a Canvas2D fallback. |
| `src/lab/` | Plasticity model, the GRU with hand-written backpropagation through time, and the training worker. |
| `src/ai/` | Guide drawer, Lens, streaming client, offline guide. |
| `src/ui/` | Scroll choreography, hero typography, publications filter, career rings, contact. |
| `worker/` | Cloudflare Worker that holds the Claude API key and runs the guide's tool loop. |
| `public/pdf/` | CV, papers and talk slides. |

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # gradient check for the in-browser neural network
npm run build      # static site in dist/
```

To edit text, change the files in `src/data/` and rebuild. Adding a paper means adding one object to `src/data/publications.js`; it appears in the index, the guide's knowledge and the offline guide.

## Connect Claude (Claude Console credits)

The API key must never reach the browser, so a small Cloudflare Worker sits between the site and the Claude API. It validates every request, rate-limits per visitor, fixes the model and the system prompt, and streams answers back.

1. **Create a key with a spending cap.** In the Claude Console, create a workspace for the website, set a monthly spend limit on it, and create an API key in that workspace.
2. **Deploy the worker** (free Cloudflare account):

   ```bash
   cd worker
   npm install
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler deploy
   ```

   Note the URL it prints, such as `https://hao-yin-lattice.<your-subdomain>.workers.dev`.
3. **Point the site at it.** In the GitHub repository, open Settings → Secrets and variables → Actions → Variables and add `CLAUDE_ENDPOINT` with that URL. The next push to `master` builds the site with the guide live.
4. **Optional automatic worker deploys.** Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets and the worker redeploys whenever its code or the site data change.

Model and cost settings live in `worker/wrangler.toml`:

| Variable | Default | Notes |
| --- | --- | --- |
| `CLAUDE_MODEL` | `claude-opus-5-5` | `claude-haiku-5-5` costs far less per token if traffic grows. |
| `CLAUDE_EFFORT` | `low` | Thinking depth for the guide; chat answers rarely need more. |
| `ALLOWED_ORIGINS` | the GitHub Pages site and localhost | Add a custom domain here. |
| `ASK_LIMITER`, `EXPLAIN_LIMITER` | 8 and 12 requests per minute per visitor | Cloudflare rate-limiting bindings. |

The worker caches the system prompt (about 8k tokens) so repeat questions read it at the cache rate, caps each conversation at 12 questions, and enables server-side refusal fallbacks. Conversations are not stored by the worker; the visitor's IP address is only sent to the API as a salted hash.

### Test without spending credits

```bash
cd worker && npm test                 # 11 tests against a local stand-in for the Claude API
node worker/test/local-stack.mjs      # serves the worker on http://localhost:8787 with scripted answers
```

With the stack running, open the built site, run `localStorage.setItem('lattice-endpoint', 'http://localhost:8787')` in the browser console and reload.

## Publish

Pushing to `master` runs `.github/workflows/deploy.yml`, which tests, builds and publishes `dist/` to the `gh-pages` branch. In the repository settings, Pages must be set to **Deploy from a branch → `gh-pages` / (root)**.

The previous Nuxt site registered a service worker; `public/sw.js` replaces it with one that clears its caches and unregisters, so returning visitors see the new site.

# Positive.Energy

A free, science-informed positivity and personal-energy hub. It has 7 private interactive tools, 16 in-depth guides, a daily rotating "Today" page, 96 curated quotes, auto-refreshed good news, 16 curated talks, and lead funnels for **coach matching** and **workplace wellbeing programs**.

- **Live:** https://positive.energy (GitHub Pages, `main` branch, root folder)
- **Monetization:** Google AdSense (`ca-pub-6620975821265271`), coach-match leads (`match.html`, `coaches.html`), B2B programs (`workplace.html`), sponsorships (`advertise.html`), reader support (`support.html`) and sponsored contests (`contests.html`)
- **Owner strip:** on every page, linked to https://web.works/contact

## Structure
| Path | What |
|---|---|
| `index.html` | Hero energy check, daily dose, tools, lead band, guides, good news, videos, workplace, FAQ |
| `daily.html` | Today's quote, affirmation, kindness idea, practice and journal prompt (rotates daily) |
| `match.html` | 4-step coach-matching funnel with live preview and consent |
| `workplace.html`, `coaches.html` | B2B proposal funnel and coach partner applications |
| `tools/` | 7 tools (logic in `assets/js/tools.js`, data stays in the visitor's browser) |
| `guides/` | 16 guides with FAQ / Article / Breadcrumb schema |
| `quotes.html`, `news.html`, `videos.html` | Content hubs |
| `support.html`, `contests.html`, `careers.html`, `advertise.html` | Revenue and community pages |
| `about`, `contact`, `privacy`, `terms`, `disclaimer`, `trademark`, `help` | Trust and legal pages |
| `_layouts/default.html` | Shared shell (owner strip, header, AdSense, footer, consent). Edit once and it applies to every page |
| `assets/js/data.js` | Quotes, affirmations, practices, prompts and challenge. Add more and the daily rotation picks them up automatically |
| `scripts/update_news.py` + `scripts/daily-refresh.yml` | Optional server-side daily refresh of the bundled news fallback and sitemap lastmod (see Deploy step 3) |

## Configuration (`assets/js/config.js`)
- **`payments`:** paste PayPal, Stripe or Buy Me a Coffee links. Support then shows checkout buttons.
- **`adSlots`:** paste manual AdSense unit IDs to fill the reserved, labelled slots. Auto ads already run.
- **`_k`:** encoded form relay key. Forms deliver through FormSubmit, and the address never appears in markup. The **first** submission triggers a one-time FormSubmit activation email; click it once.

## Deploy
1. Go to Settings → Pages → Deploy from a branch → `main` / `(root)`.
2. The `CNAME` file is `positive.energy`. At the registrar, add `A @` records pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, plus `CNAME www` pointing to `webworksa1.github.io`. Then tick **Enforce HTTPS**.
3. *(Optional)* The live Good News feed already refreshes in the browser through public RSS. To also refresh the bundled fallback daily on the server, create `.github/workflows/daily-refresh.yml` in the GitHub web UI, paste in the contents of `scripts/daily-refresh.yml`, and set Settings → Actions → General → Workflow permissions to **Read and write**.
4. In AdSense, add the site, confirm `ads.txt`, and enable a Google-certified CMP for EEA/UK/CH.

See `PROMPTS.md` for the phase-wise build prompts and `RESEARCH.md` for the 40-site audit.

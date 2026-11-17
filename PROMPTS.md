# Positive.Energy — Phase-wise Build Prompts

**Concept (chosen after a 40-site audit — see `RESEARCH.md`):** Positive.Energy is a free, science-informed *positivity & personal-energy* hub: daily rotating practices, private interactive wellbeing tools, guides, quotes, auto-refreshed good news and curated talks.

**Why this idea wins on revenue:**
1. **AdSense:** self-improvement / wellbeing traffic is high-volume, evergreen and brand-safe (high fill), with daily-return mechanics (Today page, streaks, challenge) that multiply pageviews per user.
2. **Lead generation (primary profit engine):** a 4-step **coach-matching funnel**. Life coaching sells at ~$75–$250/session, so coaches pay meaningful per-lead / featured-listing fees. A second, higher-ticket funnel targets **B2B workplace wellbeing** (workshops $1.5k+, cohort programs, keynotes).
3. **Community revenue:** reader support (tiers + pledge), sponsored monthly contests, sponsorships, careers/contributor pipeline.

The rejected alternative was positive energy as renewable/solar. It has a higher CPC, but it's crowded, YMYL-heavy, and Web already has sister properties in that space. A wellbeing angle owns the literal meaning of the phrase.

Global rules for every phase:
- AdSense publisher `ca-pub-6620975821265271`. Put this exact script in every `<head>`:
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
  plus `<meta name="google-adsense-account" content="ca-pub-6620975821265271">` and `ads.txt` → `google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`.
- Every page top: *"Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership"* linked to `https://web.works/contact`. Show the link text only, never the URL.
- All forms deliver to ONE inbox via FormSubmit AJAX. Never print the address. Store it reversed and base64-encoded in `config.js` and assemble it at runtime.
- Static only (GitHub Pages free plan, `main` branch, root). Jekyll is used just for one shared layout.
- Avoid the "PositiveEnergy" trademark issue: brand it as "Positive.Energy" (with the dot), use an original logo, and add a non-affiliation notice to the footer and `trademark.html`.

---

## Phase 1 — Foundation & design system
> Build a static GitHub Pages site for **Positive.Energy**. Create `_layouts/default.html` (Jekyll) with: SEO meta (title, description, canonical, OG/Twitter, theme-color), AdSense head script and account meta, Google Fonts (Bricolage Grotesque display + Figtree body), owner strip, sticky header with logo (original rising-sun SVG), nav (Today, Tools, Guides, Quotes, Good News, Videos, For Teams, Contests, Support, CTA "Find my coach"), dark-mode toggle, footer with newsletter form, link columns and legal/trademark notice, cookie-consent banner (Accept all / Essential only → `requestNonPersonalizedAds=1`). Page bodies go inside `{% raw %}` with front matter for title/desc/canon/ld/pre/nav_key. Design: a "sunrise" palette (night indigo #1C1442, coral→amber gradient, mint, violet), 20px radii, soft shadows, reveal-on-scroll, reduced-motion support, AA contrast, skip link.

## Phase 2 — Core JS (main.js, config.js, data.js)
> `config.js`: site name, AdSense client, optional manual ad slot IDs (display/inArticle/multiplex → reserved labelled slots fill only when set), payment links (PayPal/Stripe/BMC → Support page auto-switches from pledge to checkout), encoded form key. `data.js`: about 100 attributed quotes tagged by theme, 6 affirmation themes × 7, 18 micro-practices, 14 journal prompts, 12 kindness ideas, 30 challenge actions. `main.js`: theme, mobile menu, consent, ad-slot filler, **daily rotation by day-of-year** (quote, affirmation, practice, prompt, kindness → self-updating site), quotes library (search + theme filter + copy/share), news loader from `assets/data/news.json`, honeypot + AJAX form relay with `_subject`, URL prefill, quick-start forms that carry choices into the full funnel, multi-step forms with validation, lite-YouTube (no YouTube request until click), generic pill filters, support tiers, toast, copy/share.

## Phase 3 — Interactive tools (tools.js + /tools/)
> Seven private tools (localStorage only): (1) **Energy Score quiz**: 16 Likert questions across Physical/Emotional/Mental/Purpose → 0–100 score, archetype, bars, lowest-area recommendation, CTA to coach match pre-filled with goal, and an "email me my results" lead form; (2) **Breathing pacer**: box, 4-7-8, coherent, physiological sigh, energizing, with animated circle and cycle count; (3) **Gratitude journal**: three good things, streak, export, delete; (4) **Affirmation generator**: 6 themes, favourites, copy, speech synthesis; (5) **Mood & energy tracker**: emoji scales, tags, canvas 30-day chart, averages, "best tag" insight; (6) **30-day challenge** grid with progress; (7) **Thought reframer**: CBT-style 5 steps with thinking-trap questions and generated balanced thought. Plus a home-hero 60-second energy check (3 sliders → glowing orb score + tip). Each tool page gets an explainer, FAQ + FAQPage and WebApplication JSON-LD, ad slot and lead band.

## Phase 4 — Lead generation (highest priority for revenue)
> **match.html**: 4-step coach-matching funnel (goal cards → format/timeline/language → budget/coach preference/location → contact + explicit consent to share with ≤3 coaches + newsletter opt-in) with a live "match preview" sidebar, a coaching-vs-therapy notice, a "how it works" section and a redirect to thank-you. A reusable **lead band** (goal + format quick form → match.html with prefill) sits on home, every guide, tool, videos and daily page. **workplace.html**: B2B programs (workshop, 6-week resilience sprint, 30-day team challenge, manager training, keynote, wellbeing week) and a proposal form (company, size, program, delivery, date, budget, goals). **coaches.html**: supply side, with partner plans (pay-per-match / featured / facilitator) and an application form. The Energy Score results form doubles as a lead magnet.

## Phase 5 — Content for AdSense approval & SEO
> 16 original long-form guides (energy, positive thinking, gratitude, stress relief, morning routine, protecting energy, resilience, afternoon slump, purpose, affirmations, burnout, happiness habits, sleep, choosing a coach, positive workplace, mindfulness), each with breadcrumbs, a TOC, an in-article ad slot after section 2, a "put it into practice" tool CTA, FAQs, Article + FAQPage + BreadcrumbList JSON-LD, related guides and a multiplex slot. Guides index with search + category filters. Use hedged, research-attributed language, no medical claims, and link to help.html. Also: daily.html (Today), quotes.html, news.html, videos.html (16 verified TED/TED-Ed/Kurzgesagt talks, privacy-enhanced embeds, category filters).

## Phase 6 — Community & monetization pages
> **support.html**: $5/$15/$50/$150 tiers, frequency, "direct my support to" (operations, tools, promotion/marketing, hiring, contests/prizes), allocation bars, pledge form until payment links are set, not-tax-deductible note. **contests.html**: 4 monthly contests (gratitude story, kindness, sunrise photo, 30-day finishers draw), an entry form with 18+ and original-work checks, and official rules (no purchase necessary, Quebec/skill-testing notes). **careers.html**: 6 roles and an application form. **advertise.html**: packages including domain/site partnership and an inquiry form with a policy-safe ads note.

## Phase 7 — Trust, legal & AdSense compliance
> about (mission, editorial standards, funding), contact (form only, no email shown), privacy (FormSubmit processor, coach-sharing consent, Google's required cookie/opt-out wording, local storage, regional rights, children), terms (not advice, independent coaches, contests, IP, liability), disclaimer (medical, ads, referral fees, sponsorships), trademark & copyright (descriptive name, no affiliation with any "Positive Energy" mark), help.html (crisis lines US/CA/UK/AU/IN + findahelpline), sitemap.html, a branded 404, a noindex thank-you with per-form messages. Also robots.txt, sitemap.xml, an RSS feed of guides, site.webmanifest, favicon and OG image, ads.txt and CNAME.

## Phase 8 — Automation (self-updating)
> Live headlines load client-side from public RSS via rss2json (3h cache) merged with a bundled `assets/data/news.json` fallback. Add `scripts/update_news.py` (stdlib RSS reader for Positive News, Good News Network, Greater Good, Reasons to be Cheerful and Optimist Daily; filters promos; round-robin by source; headline + teaser + link only) and `scripts/daily-refresh.yml` to paste into `.github/workflows/` (cron 05:17 UTC + manual run; refreshes news.json, bumps sitemap lastmod, commits only on change). Combined with the client-side daily rotation, the site changes every day with zero manual work.

## Phase 9 — Deploy & launch checklist
> Push to `WEBWORKSA1/positive-eneergy` on `main`. Settings → Pages: deploy from branch `main` / root. DNS for `positive.energy`: A records 185.199.108.153 / .109.153 / .110.153 / .111.153 and `www` CNAME → `webworksa1.github.io`, then Enforce HTTPS. Settings → Actions → General → Workflow permissions: *Read and write*. Submit the first form once and click FormSubmit's activation email. In AdSense: add the site, verify ads.txt and set up a certified CMP for EEA/UK. Submit sitemap.xml to Google Search Console.

## Phase 10 — Growth roadmap (expandable)
> Add per-coach profile pages and a city/speciality coach directory (programmatic SEO). Add more guides weekly (target 60+), quiz variants (burnout risk, optimism, purpose), an email course lead magnet, Pinterest-ready quote cards (canvas → PNG), a printable 30-day challenge PDF, multilingual versions (FR/ES/HI) and a team-challenge leaderboard backed by a hosted form/DB.

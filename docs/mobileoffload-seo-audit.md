# MobileOffload SEO and Trust Audit

Audited: October 26, 2026  
Repository: `Go-Next-Level/gonextlevel-mobileoffload`  
Branch: `codex/mobileoffload-ai-seo-authority`

## Executive summary

The site is a statically generated Astro 6 project using Tailwind CSS 4, `@astrojs/sitemap`, and Cloudflare Pages conventions. The live site is fast, responsive, and visually strong, but the prior information architecture was a sales funnel with only a handful of indexable pages. Most factual authority rested on unsupported carrier, settlement, compatibility, security, and deployment claims.

Estimated baseline scores:

| Area | Baseline | Main issue |
|---|---:|---|
| Technical SEO | 62/100 | sitemap/canonical gaps, orphan pages, utility routes indexed |
| Content quality | 41/100 | sales-heavy copy, thin topic coverage, weak sourcing |
| AI citation readiness | 38/100 | no stable answer pages, limited sources, unclear evidence chain |

## Architecture found

- Astro static generation; meaningful content is present in initial HTML.
- Tailwind 4 through the Vite plugin.
- Cloudflare Pages-compatible static output in `dist/`.
- Homepage and several sales pages use `Enterprise.astro`; the privacy page previously used an older `Base.astro` design.
- Assessment forms post from the browser to an existing LeadConnector/GoHighLevel webhook.
- Existing analytics: GA4, IDPixel, and an OpenAI pixel.
- Sitemap integration and `public/robots.txt` existed; no versioned headers or redirects existed.
- No test, lint, link-check, accessibility, or schema-validation scripts were configured.

## Implemented fixes

### Crawlability and information architecture

- Added eight core permanent guides, five differentiated industry guides, About, and a dedicated network-assessment route.
- Added site-wide Learn navigation, expanded footer links, breadcrumbs, related links, and homepage resource cards.
- Added redirects for legacy `/franchise/` and `/gyms/` URLs.
- Excluded `/thank-you/`, `/og-image/`, and redirected legacy URLs from the sitemap.
- Added explicit allow rules for OAI-SearchBot, ChatGPT-User, GPTBot, and PerplexityBot.
- Added a factual `llms.txt`. This is optional discovery metadata, not a ranking or citation guarantee; Google states no special AI markup is required.

### Metadata and structured data

- Added a WebSite, Organization, and WebPage graph to the homepage.
- Added self-referencing canonical URLs, Article/WebPage, BreadcrumbList, and visible-content-matched FAQPage data to resource pages.
- Added unique titles and descriptions to every new route.
- Excluded utility routes from the sitemap and added `noindex` to the custom 404 and thank-you page.

### Trust and content

- Replaced homepage headline metadata and opening claims with qualified, direct language.
- Replaced unsupported homepage metrics with qualification principles.
- Changed the old deployment table to an evidence-review state rather than repeating exact unverified figures.
- Built an evidence-first case-study page that explains what records are required.
- Used provider-owned sources and labels such as “provider-reported” and “Not publicly confirmed.”
- Added visible review dates, direct answers, limitations, source sections, and role definitions.

### UX and conversion

- Preserved the existing form fields, consent, LeadConnector destination, validation, and thank-you flow.
- Added a hidden honeypot and `aria-live` submission error.
- Added GA4 events for CTA clicks, resource-link clicks, form start, and successful submission.
- Created a dedicated assessment page so resource visitors are not dropped far above the form on mobile.
- Added focus treatments, a 44px menu target, responsive tables, and higher-contrast muted text.
- Migrated the privacy page into the current Enterprise visual shell without changing its substantive disclosures.

## Claims requiring owner evidence

Do not reintroduce or expand these without current records:

1. AT&T, T-Mobile, Google Fi, or “six major carriers” are directly enabled across the claimed network or location.
2. 576 TB per quarter, 124K+ subscribers, 555% growth, and the named airport/mall/gym/restaurant/retail results.
3. That those examples are direct MobileOffload deployments or independently audited.
4. A universal 50/50 venue share, payment by the fifth, or a fixed per-GB rate.
5. Six-month cancellation, 30-day notice, annual rollover, automatic renewal, or the statement that a carrier requires the term.
6. One-hour setup, software-only deployment, or no new hardware across all supported brands.
7. “Zero impact,” “zero access,” “fully isolated,” guaranteed WPA3/RadSec, or other absolute security outcomes.
8. Current scope and authorization of the Hudson House relationship.

## Critical privacy discrepancy — owner/legal action

The preserved privacy policy says forms use Web3Forms and that the site does not use tracking pixels or fingerprinting. The actual code posts assessment submissions to LeadConnector/GoHighLevel and loads GA4, IDPixel, and an OpenAI pixel. The policy also makes claims about data retention and sharing that cannot be verified from the repository.

This was not silently rewritten because it is a legal disclosure. Before production release, counsel or the authorized owner should reconcile:

- actual form processor and downstream lead routing;
- analytics/pixel providers, cookies, identifiers, and consent requirements;
- retention and deletion behavior;
- sharing with Hudson House or network providers;
- California and other applicable privacy notices.

## Remaining technical owner actions

- Configure a Cloudflare host redirect from `www.mobileoffload.com` to the apex domain.
- Move the webhook behind a Cloudflare Function/Worker with origin/schema validation, rate limiting, and a server-held destination; add Turnstile if approved.
- Review `_headers` in preview, particularly HSTS and framing behavior, before production.
- Verify preview deployments emit `X-Robots-Tag: noindex` or equivalent while production remains indexable.
- Confirm Cloudflare’s Node runtime requirement. The project declares Node `>=22.12.0`; this differs from the provided Node 20 standard because Astro 6 drives the newer requirement.
- Validate current data in Google Search Console and Bing Webmaster Tools.

## Live technical observations

- HTTPS and `X-Content-Type-Options` were present.
- Live TTFB during audit was approximately 0.12–0.18 seconds.
- Static HTML was approximately 23–35 KB; content does not depend on client rendering.
- Primary performance risk is third-party analytics and remote Google Fonts, not page imagery.
- The live homepage showed no horizontal overflow at 375, 768, or 1440px.

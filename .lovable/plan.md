# BusinessConnect SA — MVP completion plan (4 changes)

The journey is location → AI search → results → profile → enquiry. Most of it already exists (location picker, 9-province data, deterministic search + fallbacks, business profile page, AI server functions). Three gaps block the demo, plus the app currently fails typecheck.

## 1. Fix the build (highest priority)
The app does not typecheck today: filter setters on the search page conflict with strict optional types, and the homepage links to pages that don't exist (`/workplace`, `/register`, `/south-africa`, `/responsible-ai`). Fix the filter setters and point the homepage links at routes that exist so the journey is clickable end to end. No design change.

## 2. Customer enquiry on the business profile
Add a compact enquiry form to the business profile page (name, contact, message), saving to the existing local store with a success toast, so the last step of the journey works. Reuse existing card and button styles.

## 3. Natural-language AI search on the results page
The results page ranks deterministically but never calls the AI. Add a short AI summary of the matched results at the top of the search page, using the existing chatbot server function and only the businesses already matched — no new UI patterns.

## 4. Responsible AI safeguards, visible
Show the existing AI disclaimer wherever AI text appears (search summary and any AI output), stating results come from the platform's own listings and that AI can be wrong. Keeps the no-fabrication rules already in the prompts visible to users.

## Out of scope
Workplace tools, dashboard, admin, auth/Cloud persistence, and any redesign — deferred to keep credit use minimal.

## Technical notes
- `src/routes/explore.tsx`: setter fixes for `exactOptionalPropertyTypes`.
- `src/routes/index.tsx`: retarget dead `<Link to>` values.
- `src/routes/business.$slug.tsx`: enquiry form → `src/lib/store.ts`.
- Reuse `src/lib/ai.functions.ts` and `src/components/AiPanel.tsx`; no new dependencies, no schema changes.

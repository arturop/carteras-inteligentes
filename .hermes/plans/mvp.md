# Carteras Inteligentes MVP Implementation Plan

> **For Hermes:** Use robust agentic development principles: inspect, implement small tasks, test domain logic, verify build, then deploy when credentials are available.

**Goal:** Build the first usable client-side Spanish Smart Portfolios workflow for Spanish investors.

**Architecture:** Static React/TypeScript app. Domain calculations live in pure TypeScript functions with tests. UI guides the user through profile, current portfolio, target allocation, and action plan.

**Tech Stack:** Vite, React, TypeScript, Vitest.

---

## Task 1: Project skeleton and docs

**Objective:** Initialize React/Vite/TypeScript, add product and technical briefs, and ensure scripts exist.

**Files:**
- Create: `docs/PRODUCT.md`
- Create: `docs/TECHNICAL_BRIEF.md`
- Create: `.hermes/plans/mvp.md`
- Modify: `package.json`

**Verification:**
- `npm install`
- `npm run build`

---

## Task 2: Domain model and tests

**Objective:** Implement pure functions for investor profile, holdings, allocation, target portfolio, rebalancing and Spain warnings.

**Files:**
- Create: `src/domain/investorProfile.ts`
- Create: `src/domain/portfolio.ts`
- Create: `src/domain/allocation.ts`
- Create: `src/domain/rebalancing.ts`
- Create: `src/domain/spainWarnings.ts`
- Create: `src/domain/domain.test.ts`

**Verification:**
- `npm run test -- --run`

---

## Task 3: App state and storage

**Objective:** Provide initial sample state, local reducer-like state handling, export/import JSON helpers, and optional localStorage persistence.

**Files:**
- Create: `src/app/appState.ts`
- Create: `src/storage/localPlanStore.ts`

**Verification:**
- Storage helpers handle invalid JSON safely.
- `npm run test -- --run`

---

## Task 4: App shell and navigation

**Objective:** Build an app-like Spanish layout with persistent progress navigation.

**Files:**
- Create: `src/components/AppLayout.tsx`
- Create: `src/components/Card.tsx`
- Create: `src/components/FormField.tsx`
- Create: `src/components/ProgressNav.tsx`
- Create: `src/styles/app.css`
- Modify: `src/app/App.tsx`

**Verification:**
- `npm run build`
- Browser: layout shows sidebar/progress navigation and no console errors.

---

## Task 5: MVP pages

**Objective:** Implement the first workflow: Inicio → Perfil → Cartera actual → Cartera objetivo → Plan.

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ProfilePage.tsx`
- Create: `src/pages/PortfolioPage.tsx`
- Create: `src/pages/TargetPage.tsx`
- Create: `src/pages/ActionPlanPage.tsx`

**Verification:**
- User can complete the flow manually.
- Outputs update from inputs.
- `npm run build` passes.

---

## Task 6: Public deployment

**Objective:** Publish on a free static host and verify the public URL.

**Preferred:** GitHub Pages if GitHub auth is available.

**Fallbacks:** Cloudflare Pages, Netlify, Vercel if credentials are configured.

**Verification:**
- Public URL loads.
- Hard refresh works.
- App has no backend calls.

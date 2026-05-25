# Carteras Inteligentes — Technical Brief

## Stack
- Vite
- React
- TypeScript
- Vitest + React Testing Library for tests
- Static client-side deployment

## Deployment target
Preferred free online target: GitHub Pages, Cloudflare Pages, Netlify or Vercel.

Current environment note: `gh` is installed but not authenticated, so automatic GitHub Pages publishing will require GitHub authentication or another deployment credential.

## Privacy architecture
- No backend.
- No account system.
- No analytics or tracking in MVP.
- All portfolio data stored only in browser memory/localStorage if the user chooses to save.
- Export/import via local JSON file.

## Directory structure
```txt
src/
  app/
    App.tsx
    appState.ts
  components/
    AppLayout.tsx
    Card.tsx
    FormField.tsx
    ProgressNav.tsx
  domain/
    investorProfile.ts
    portfolio.ts
    allocation.ts
    rebalancing.ts
    spainWarnings.ts
  pages/
    HomePage.tsx
    ProfilePage.tsx
    PortfolioPage.tsx
    TargetPage.tsx
    ActionPlanPage.tsx
  storage/
    localPlanStore.ts
  styles/
    app.css
```

## Commands
```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
```

## Quality gates
1. `npm run test` must pass.
2. `npm run build` must pass.
3. Browser console should be clean on the MVP flow.
4. No network calls for portfolio data.
5. Every calculation function in `src/domain/` should have unit coverage.

## Design direction
- Spanish-first copy.
- App-like layout with persistent navigation.
- Clear privacy promise.
- Progressive workflow, not chapters.
- Avoid false precision in expected returns.
- Use accessible forms and semantic HTML.

## Implementation constraints
- Avoid introducing backend dependencies.
- Avoid regulated financial-advice language.
- Avoid using copyrighted text from *Smart Portfolios*.
- Keep calculations transparent and explainable.

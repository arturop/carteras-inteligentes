# Carteras Inteligentes — Product Brief

## Goal
Build a Spanish-first, client-side web app that helps investors in Spain apply systematic portfolio-construction principles inspired by Rob Carver's *Smart Portfolios*.

The product should feel like an app and guided workflow, not a set of chapter notes or disconnected calculators.

## Target user
Spanish retail investors who want to build, understand, and periodically review a robust long-term portfolio without sending private financial data to a server.

## Core promise
- Private by design: calculations happen locally in the browser.
- Spain-aware: EUR defaults, Spanish product vocabulary, fiscal friction warnings for funds/ETFs/stocks.
- Systematic: risk, diversification, costs, rebalancing and behaviour over forecasts.
- Educational: not personalized financial advice.

## MVP thin slice
The first useful version lets a user:
1. Understand the privacy and educational scope.
2. Fill a simple investor profile.
3. Enter current holdings manually.
4. See current allocation by asset class and currency.
5. Receive a simple strategic target allocation.
6. Compare current vs target allocation.
7. Get rebalancing suggestions and Spain-specific warnings.
8. Export/import the plan locally as JSON.

## MVP screens
1. Inicio
2. Perfil inversor
3. Cartera actual
4. Cartera objetivo
5. Plan de acción

## Out of scope for MVP
- Broker integrations.
- Backend, accounts, authentication, or cloud sync.
- Tax calculation engine.
- Product recommendations by ISIN.
- Real-time market data.
- Personalized regulated financial advice.
- Copying or summarizing the book chapter by chapter.

## Product principles
- App workflow over chapters.
- Defaults over blank pages.
- Warnings over false precision.
- Ranges and robustness over forecasts.
- Rebalancing rules over market timing.
- Simplicity for the default investor, flexibility for advanced users later.

## Spain-specific assumptions
- Default currency: EUR.
- Language: Spanish.
- Product vocabulary: fondos de inversión, fondos indexados, ETFs, acciones, renta fija, monetarios, planes de pensiones, liquidez.
- Include fiscal-friction warnings: fund transfers may be fiscally different from ETF/stock sales; review tax implications before selling.
- Include cost warnings: TER, custody fees, FX conversion fees, distribution/dividend friction.

## Compliance copy direction
Use clear educational disclaimers:

> Esta herramienta es educativa y no constituye asesoramiento financiero personalizado. Los datos no salen de tu navegador. Antes de operar, revisa costes, fiscalidad y adecuación a tu situación personal.

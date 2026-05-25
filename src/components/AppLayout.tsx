import type { ReactNode } from 'react';
import type { StepId } from '../app/appState';
import { steps } from '../app/appState';
import { ProgressNav } from './ProgressNav';

interface AppLayoutProps {
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
  children: ReactNode;
}

export function AppLayout({ currentStep, onStepChange, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Progreso de la aplicación">
        <div className="brand-block">
          <div className="brand-mark">CI</div>
          <div>
            <p className="eyebrow">Smart Portfolios para España</p>
            <h1>Carteras Inteligentes</h1>
          </div>
        </div>
        <ProgressNav steps={steps} currentStep={currentStep} onStepChange={onStepChange} />
        <div className="privacy-box">
          <strong>Privacidad</strong>
          <span>Tus datos se calculan en este navegador. No hay backend ni tracking.</span>
        </div>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}

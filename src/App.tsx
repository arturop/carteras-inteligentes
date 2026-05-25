import { useEffect, useState } from 'react';
import './styles/app.css';
import { AppLayout } from './components/AppLayout';
import type { AppState, StepId } from './app/appState';
import { initialAppState, nextStep } from './app/appState';
import { importPlanJson, loadPlan, savePlan } from './storage/localPlanStore';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TargetPage } from './pages/TargetPage';
import { ActionPlanPage } from './pages/ActionPlanPage';

function App() {
  const [state, setState] = useState<AppState>(() => loadPlan() ?? initialAppState);

  useEffect(() => {
    savePlan(state);
  }, [state]);

  function setStep(step: StepId) {
    setState((current) => ({ ...current, currentStep: step }));
  }

  function goNext() {
    setState((current) => ({ ...current, currentStep: nextStep(current.currentStep) }));
  }

  function handleImport(json: string) {
    const imported = importPlanJson(json);
    if (imported) {
      setState(imported);
    }
  }

  return (
    <AppLayout currentStep={state.currentStep} onStepChange={setStep}>
      {state.currentStep === 'inicio' && <HomePage onNext={setStep} onImport={handleImport} />}
      {state.currentStep === 'perfil' && (
        <ProfilePage
          profile={state.profile}
          onChange={(profile) => setState((current) => ({ ...current, profile }))}
          onNext={goNext}
        />
      )}
      {state.currentStep === 'cartera' && (
        <PortfolioPage
          holdings={state.holdings}
          onChange={(holdings) => setState((current) => ({ ...current, holdings }))}
          onNext={goNext}
        />
      )}
      {state.currentStep === 'objetivo' && <TargetPage profile={state.profile} holdings={state.holdings} onNext={goNext} />}
      {state.currentStep === 'plan' && <ActionPlanPage state={state} profile={state.profile} holdings={state.holdings} />}
    </AppLayout>
  );
}

export default App;

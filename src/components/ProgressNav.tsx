import type { StepId } from '../app/appState';

interface ProgressNavProps {
  steps: Array<{ id: StepId; label: string; description: string }>;
  currentStep: StepId;
  onStepChange: (step: StepId) => void;
}

export function ProgressNav({ steps, currentStep, onStepChange }: ProgressNavProps) {
  return (
    <nav className="progress-nav">
      {steps.map((step, index) => (
        <button
          key={step.id}
          className={'progress-item ' + (step.id === currentStep ? 'active' : '')}
          onClick={() => onStepChange(step.id)}
          type="button"
        >
          <span className="step-number">{index + 1}</span>
          <span>
            <strong>{step.label}</strong>
            <small>{step.description}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}

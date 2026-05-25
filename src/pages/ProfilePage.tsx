import type { InvestorProfile } from '../domain/investorProfile';
import { assessInvestorRisk } from '../domain/investorProfile';
import { Card } from '../components/Card';
import { FormField, NumberInput } from '../components/FormField';

interface ProfilePageProps {
  profile: InvestorProfile;
  onChange: (profile: InvestorProfile) => void;
  onNext: () => void;
}

export function ProfilePage({ profile, onChange, onNext }: ProfilePageProps) {
  const risk = assessInvestorRisk(profile);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Paso 1</p>
        <h2>Perfil inversor</h2>
        <p>Traducimos horizonte, liquidez y tolerancia a caídas en una asignación estratégica simple.</p>
      </div>

      <div className="two-column">
        <Card title="Tus datos básicos">
          <div className="form-grid">
            <FormField label="Edad"><NumberInput value={profile.age} onChange={(age) => onChange({ ...profile, age })} /></FormField>
            <FormField label="Horizonte temporal (años)"><NumberInput value={profile.horizonYears} onChange={(horizonYears) => onChange({ ...profile, horizonYears })} /></FormField>
            <FormField label="Aportación mensual (€)"><NumberInput value={profile.monthlyContribution} step={50} onChange={(monthlyContribution) => onChange({ ...profile, monthlyContribution })} /></FormField>
            <FormField label="Colchón de liquidez (meses)"><NumberInput value={profile.emergencyFundMonths} onChange={(emergencyFundMonths) => onChange({ ...profile, emergencyFundMonths })} /></FormField>

            <FormField label="Tolerancia a caídas">
              <select value={profile.drawdownTolerance} onChange={(event) => onChange({ ...profile, drawdownTolerance: event.target.value as InvestorProfile['drawdownTolerance'] })}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="muy-alta">Muy alta</option>
              </select>
            </FormField>

            <FormField label="Estabilidad de ingresos">
              <select value={profile.incomeStability} onChange={(event) => onChange({ ...profile, incomeStability: event.target.value as InvestorProfile['incomeStability'] })}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </FormField>

            <FormField label="Experiencia inversora">
              <select value={profile.experience} onChange={(event) => onChange({ ...profile, experience: event.target.value as InvestorProfile['experience'] })}>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </FormField>

            <label className="checkbox-field">
              <input type="checkbox" checked={profile.prefersFunds} onChange={(event) => onChange({ ...profile, prefersFunds: event.target.checked })} />
              Prefiero fondos traspasables cuando tenga sentido fiscal
            </label>
          </div>
        </Card>

        <Card title={'Resultado: ' + risk.label} tone="highlight">
          <div className="target-big">{risk.equityTarget}/{risk.bondTarget}/{risk.cashTarget}</div>
          <p>Renta variable / renta fija / liquidez</p>
          <p><strong>Caída dolorosa orientativa:</strong> {risk.maxSuggestedDrawdown}</p>
          {risk.notes.length > 0 && <ul>{risk.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
          <button className="primary-button" onClick={onNext} type="button">Continuar a cartera actual</button>
        </Card>
      </div>
    </div>
  );
}

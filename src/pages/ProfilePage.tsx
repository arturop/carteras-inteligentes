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
            <FormField label="Edad" help="Determina cuánto tiempo puedes mantener la cartera sin necesidad de vender."><NumberInput value={profile.age} onChange={(age) => onChange({ ...profile, age })} /></FormField>
            <FormField label="Horizonte temporal (años)" help="Años previstos hasta que necesites usar el capital. A mayor horizonte, más riesgo puedes asumir."><NumberInput value={profile.horizonYears} onChange={(horizonYears) => onChange({ ...profile, horizonYears })} /></FormField>
            <FormField label="Años hasta la jubilación" help="Años que te quedan hasta que dejes de trabajar y empieces a vivir de la cartera. Durante esta fase solo acumulas, no retiras."><NumberInput value={profile.yearsToRetirement} onChange={(yearsToRetirement) => onChange({ ...profile, yearsToRetirement })} /></FormField>
            <FormField label="Aportación mensual (€)" help="Cantidad media que piensas invertir cada mes. Ayuda a planificar el rebalanceo con nuevas aportaciones."><NumberInput value={profile.monthlyContribution} step={50} onChange={(monthlyContribution) => onChange({ ...profile, monthlyContribution })} /></FormField>
            <FormField label="Colchón de liquidez (meses)" help="Meses de gastos cubiertos en cuenta corriente o monetario. Si es bajo, conviene no asumir demasiado riesgo."><NumberInput value={profile.emergencyFundMonths} onChange={(emergencyFundMonths) => onChange({ ...profile, emergencyFundMonths })} /></FormField>

            <FormField label="Tolerancia a caídas" help="Caída máxima que podrías soportar sin vender por pánico. Sé honesto: en crisis reales, la tolerancia suele ser menor de la que creemos.">
              <select value={profile.drawdownTolerance} onChange={(event) => onChange({ ...profile, drawdownTolerance: event.target.value as InvestorProfile['drawdownTolerance'] })}>
                <option value="baja">Baja — no quiero ver pérdidas superiores al 10%</option>
                <option value="media">Media — puedo tolerar caídas del 15–25%</option>
                <option value="alta">Alta — asumo caídas del 25–35%</option>
                <option value="muy-alta">Muy alta — acepto caídas superiores al 35%</option>
              </select>
            </FormField>

            <FormField label="Estabilidad de ingresos" help="Si tus ingresos son estables, puedes permitirte más riesgo en cartera. Si son inciertos, conviene ser más prudente.">
              <select value={profile.incomeStability} onChange={(event) => onChange({ ...profile, incomeStability: event.target.value as InvestorProfile['incomeStability'] })}>
                <option value="baja">Baja — ingresos irregulares o inciertos</option>
                <option value="media">Media — empleo estable pero sin grandes colchones</option>
                <option value="alta">Alta — ingresos estables y previsibles</option>
              </select>
            </FormField>

            <FormField label="Experiencia inversora" help="No afecta al cálculo de riesgo, pero sí a las explicaciones y advertencias que verás después.">
              <select value={profile.experience} onChange={(event) => onChange({ ...profile, experience: event.target.value as InvestorProfile['experience'] })}>
                <option value="principiante">Principiante — llevo poco tiempo invirtiendo</option>
                <option value="intermedio">Intermedio — conozco los productos básicos</option>
                <option value="avanzado">Avanzado — gestiono mi cartera activamente</option>
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

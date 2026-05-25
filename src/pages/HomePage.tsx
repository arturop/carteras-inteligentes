import type { StepId } from '../app/appState';
import { Card } from '../components/Card';

interface HomePageProps {
  onNext: (step: StepId) => void;
}

export function HomePage({ onNext }: HomePageProps) {
  return (
    <div className="page-stack">
      <section className="hero">
        <p className="eyebrow">Aplicación educativa · 100% cliente</p>
        <h2>Construye una cartera robusta sin enviar tus datos a ningún servidor.</h2>
        <p>
          Carteras Inteligentes convierte principios de construcción sistemática de carteras en un flujo práctico para inversores en España.
          No es un resumen por capítulos: es una herramienta para diagnosticar, asignar, rebalancear y documentar tu plan.
        </p>
        <button className="primary-button" onClick={() => onNext('perfil')} type="button">Empezar diagnóstico</button>
      </section>

      <div className="grid-3">
        <Card title="Privado por diseño">
          <p>La cartera se calcula en tu navegador. En el MVP no hay cuentas, backend, tracking ni llamadas externas.</p>
        </Card>
        <Card title="Pensado para España">
          <p>Lenguaje, divisa y avisos adaptados: fondos, ETFs, fiscalidad al vender, costes y traspasos.</p>
        </Card>
        <Card title="Reglas, no predicciones">
          <p>Riesgo, diversificación, costes y rebalanceo importan más que acertar el mercado del año que viene.</p>
        </Card>
      </div>

      <Card title="Aviso importante" tone="warning">
        <p>Esta herramienta es educativa y no constituye asesoramiento financiero personalizado. Antes de operar, revisa fiscalidad, costes y adecuación a tu situación.</p>
      </Card>
    </div>
  );
}

import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  tone?: 'default' | 'highlight' | 'warning';
}

export function Card({ title, subtitle, children, tone = 'default' }: CardProps) {
  return (
    <section className={'card card-' + tone}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}

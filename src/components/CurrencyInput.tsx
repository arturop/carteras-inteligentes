import { useEffect, useState } from 'react';

interface CurrencyInputProps {
  id: string;
  label: string;
  help: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ id, label, help, value, step = 500, onChange }: CurrencyInputProps) {
  const [local, setLocal] = useState(formatDisplay(value));

  useEffect(() => {
    setLocal(formatDisplay(value));
  }, [value]);

  function handleChange(next: string) {
    const cleaned = next.replace(/[^0-9]/g, '');
    if (cleaned === '') {
      setLocal('');
      onChange(0);
      return;
    }
    const parsed = Number(cleaned);
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }
    const rounded = Math.round(parsed / step) * step;
    setLocal(formatDisplay(rounded));
    onChange(rounded);
  }

  function handleBlur() {
    if (local === '') {
      setLocal('0');
      onChange(0);
    }
  }

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
      />
      <p className="input-help">{help}</p>
    </div>
  );
}

function formatDisplay(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0';
  return Math.round(value).toLocaleString('es-ES');
}

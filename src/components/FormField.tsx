import type { ChangeEvent, ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  help?: string;
  children?: ReactNode;
}

export function FormField({ label, help, children }: FormFieldProps) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  );
}

interface NumberInputProps {
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ value, min = 0, step = 1, onChange }: NumberInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return <input type="number" value={value} min={min} step={step} onChange={handleChange} />;
}

import { useRef, useEffect, type ReactNode } from 'react';

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
  id?: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ id, value, min = 0, step = 1, onChange }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (inputRef.current && !mountedRef.current) {
      mountedRef.current = true;
      inputRef.current.value = String(value);
    }
  }, [value]);

  function handleFocus() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleBlur() {
    const raw = inputRef.current?.value ?? '';
    const parsed = Number(raw);
    if (raw === '' || isNaN(parsed) || parsed < min) {
      onChange(min);
      if (inputRef.current) inputRef.current.value = String(min);
      return;
    }
    onChange(parsed);
    if (inputRef.current) inputRef.current.value = String(parsed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
      inputRef.current?.blur();
    }
  }

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
}

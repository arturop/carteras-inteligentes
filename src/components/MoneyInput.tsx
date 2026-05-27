import { useRef, useEffect } from 'react';

interface MoneyInputProps {
  id: string;
  label: string;
  help: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

export function MoneyInput({ id, label, help, value, step = 500, onChange }: MoneyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  function fmt(n: number): string {
    if (!Number.isFinite(n) || n <= 0) return '0';
    return Math.round(n).toLocaleString('es-ES');
  }

  // Set initial value on mount
  useEffect(() => {
    if (inputRef.current && !mountedRef.current) {
      mountedRef.current = true;
      inputRef.current.value = fmt(value);
      console.log('[MoneyInput] mount', id, 'value=', value, 'input.value=', inputRef.current.value);
    }
  }, [id, value]);

  function handleFocus() {
    console.log('[MoneyInput] focus', id, 'before:', inputRef.current?.value);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    console.log('[MoneyInput] focus', id, 'after:', inputRef.current?.value);
  }

  function handleBlur() {
    const raw = inputRef.current?.value ?? '';
    console.log('[MoneyInput] blur', id, raw);
    const cleaned = raw.replace(/[^0-9]/g, '');
    if (cleaned === '' || cleaned === '0') {
      onChange(0);
      if (inputRef.current) inputRef.current.value = '0';
      return;
    }
    const parsed = Number(cleaned);
    if (isNaN(parsed) || parsed < 0) {
      onChange(0);
      if (inputRef.current) inputRef.current.value = '0';
      return;
    }
    const rounded = Math.round(parsed / step) * step;
    onChange(rounded);
    if (inputRef.current) inputRef.current.value = fmt(rounded);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    console.log('[MoneyInput] keydown', id, e.key);
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
      inputRef.current?.blur();
    }
  }

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
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
      <p className="input-help">{help}</p>
    </div>
  );
}

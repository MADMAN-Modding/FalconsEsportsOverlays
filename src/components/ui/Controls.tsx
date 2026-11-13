import { FC, ReactNode } from 'react';
import { MinusIcon, PlusIcon } from './icons';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Switch: FC<SwitchProps> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 border transition-colors ${
      checked ? 'border-falcons-primary bg-falcons-primary' : 'border-ink-500 bg-ink-900'
    }`}
  >
    <span
      className={`absolute top-0.5 h-4 w-4 transition-all ${
        checked ? 'left-[calc(100%-1.125rem)] bg-white' : 'left-0.5 bg-ink-300'
      }`}
    />
  </button>
);

interface SegmentedProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const Segmented: FC<SegmentedProps> = ({ options, value, onChange, label }) => (
  <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col border border-ink-600">
    {options.map((option) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={value === option}
        onClick={() => onChange(option)}
        className={`h-10 border-r border-ink-600 font-display text-lg font-semibold transition-colors last:border-r-0 ${
          value === option ? 'bg-falcons-primary text-white' : 'bg-ink-900 text-ink-300 hover:bg-ink-700 hover:text-white'
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

interface StepperProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const Stepper: FC<StepperProps> = ({ value, onChange, label }) => {
  const step = (delta: number) => {
    const current = parseInt(value, 10);
    onChange(String(Math.max(0, (Number.isNaN(current) ? 0 : current) + delta)));
  };

  return (
    <div className="flex h-14 border border-ink-600 bg-ink-900">
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label={`Decrease ${label}`}
        className="flex w-14 items-center justify-center border-r border-ink-600 text-ink-300 transition-colors hover:bg-ink-700 hover:text-white"
      >
        <MinusIcon size={20} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        className="min-w-0 flex-1 bg-transparent text-center font-display text-4xl font-bold tabular-nums text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-falcons-bright"
      />
      <button
        type="button"
        onClick={() => step(1)}
        aria-label={`Increase ${label}`}
        className="flex w-14 items-center justify-center border-l border-ink-600 text-ink-300 transition-colors hover:bg-ink-700 hover:text-white"
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
};

interface FieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export const Field: FC<FieldProps> = ({ label, htmlFor, children }) => (
  <div>
    <label className="label" htmlFor={htmlFor}>
      {label}
    </label>
    {children}
  </div>
);

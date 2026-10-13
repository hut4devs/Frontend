import { forwardRef, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, errorMessage, disabled = false, required = false, id, className = "", ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!errorMessage;
    const describedBy = [hint && `${checkboxId}-hint`, errorMessage && `${checkboxId}-error`].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
        </div>
        <div className="text-sm">
          <label htmlFor={checkboxId} className={`font-medium cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : "text-gray-900"}`}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            {required && <span className="sr-only">(required)</span>}
          </label>
          {hint && !hasError && (
            <p id={`${checkboxId}-hint`} className="mt-0.5 text-sm text-gray-500" role="hint">
              {hint}
            </p>
          )}
          {errorMessage && (
            <p id={`${checkboxId}-error`} className="mt-0.5 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  name: string;
  value: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, hint, errorMessage, disabled = false, required = false, name, value, id, className = "", ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!errorMessage;
    const describedBy = [hint && `${radioId}-hint`, errorMessage && `${radioId}-error`].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          />
        </div>
        <div className="text-sm">
          <label htmlFor={radioId} className={`font-medium cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : "text-gray-900"}`}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
            {required && <span className="sr-only">(required)</span>}
          </label>
          {hint && !hasError && (
            <p id={`${radioId}-hint`} className="mt-0.5 text-sm text-gray-500" role="hint">
              {hint}
            </p>
          )}
          {errorMessage && (
            <p id={`${radioId}-error`} className="mt-0.5 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Radio.displayName = "Radio";

export interface RadioGroupProps {
  name: string;
  label: string;
  hint?: string;
  errorMessage?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  name,
  label,
  hint,
  errorMessage,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  orientation = "vertical",
}: RadioGroupProps) {
  const hasError = !!errorMessage;
  const groupId = `radiogroup-${name}`;
  const describedBy = [hint && `${groupId}-hint`, errorMessage && `${groupId}-error`].filter(Boolean).join(" ") || undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <fieldset
      id={groupId}
      aria-describedby={describedBy}
      aria-invalid={hasError}
      className="w-full"
      disabled={disabled}
    >
      <legend className={`text-sm font-medium mb-2 ${disabled ? "opacity-50" : "text-gray-900"}`}>
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className={orientation === "horizontal" ? "flex flex-wrap gap-6" : "space-y-3"}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            label={option.label}
            disabled={disabled || option.disabled}
            required={required}
            checked={value === option.value}
            onChange={handleChange}
          />
        ))}
      </div>
      {hint && !hasError && (
        <p id={`${groupId}-hint`} className="mt-1 text-sm text-gray-500" role="hint">
          {hint}
        </p>
      )}
      {errorMessage && (
        <p id={`${groupId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
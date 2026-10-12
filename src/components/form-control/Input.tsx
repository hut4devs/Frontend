import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { Label } from "./Label";

export type InputSize = "sm" | "md" | "lg";
export type InputState = "default" | "error" | "success";

interface BaseInputProps {
  id: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  state?: InputState;
  size?: InputSize;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export interface InputProps extends Omit<BaseInputProps, "id">, Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id"> {
  id: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface TextareaProps extends Omit<BaseInputProps, "id">, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "id"> {
  id: string;
  rows?: number;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<BaseInputProps, "id">, Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "id"> {
  id: string;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
}

const baseInputStyles = "w-full rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed";

const sizeStyles: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const stateStyles: Record<InputState, string> = {
  default: "border-gray-300 focus-visible:ring-blue-500",
  error: "border-red-500 focus-visible:ring-red-500",
  success: "border-green-500 focus-visible:ring-green-500",
};

const iconWrapperStyles = "absolute inset-y-0 flex items-center pointer-events-none text-gray-400";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      hint,
      errorMessage,
      state = "default",
      size = "md",
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      leftIcon,
      rightIcon,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const hasError = state === "error";
    const describedBy = [hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <Label htmlFor={id} required={required} disabled={disabled}>
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={`${iconWrapperStyles} left-3`} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            className={`${baseInputStyles} ${sizeStyles[size]} ${stateStyles[state]} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className={`${iconWrapperStyles} right-3`} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {hint && !hasError && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500" role="hint">
            {hint}
          </p>
        )}
        {errorMessage && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      label,
      hint,
      errorMessage,
      state = "default",
      size = "md",
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      rows = 3,
      ...props
    },
    ref,
  ) => {
    const hasError = state === "error";
    const describedBy = [hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <Label htmlFor={id} required={required} disabled={disabled}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          rows={rows}
          className={`${baseInputStyles} ${sizeStyles[size]} ${stateStyles[state]} resize-y ${className}`}
          {...props}
        />
        {hint && !hasError && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500" role="hint">
            {hint}
          </p>
        )}
        {errorMessage && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      hint,
      errorMessage,
      state = "default",
      size = "md",
      required = false,
      disabled = false,
      fullWidth = true,
      className = "",
      options,
      placeholder,
      multiple = false,
      ...props
    },
    ref,
  ) => {
    const hasError = state === "error";
    const describedBy = [hint && `${id}-hint`, errorMessage && `${id}-error`].filter(Boolean).join(" ") || undefined;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <Label htmlFor={id} required={required} disabled={disabled}>
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          multiple={multiple}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          className={`${baseInputStyles} ${sizeStyles[size]} ${stateStyles[state]} appearance-none bg-white ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {hint && !hasError && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-gray-500" role="hint">
            {hint}
          </p>
        )}
        {errorMessage && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
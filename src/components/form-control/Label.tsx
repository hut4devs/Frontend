import { forwardRef, type LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, disabled = false, children, className = "", htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={`block text-sm font-medium mb-1 ${disabled ? "opacity-50 cursor-not-allowed" : "text-gray-700"} ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
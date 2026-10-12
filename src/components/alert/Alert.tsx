import { forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { Button, type ButtonProps } from "../button";

export type AlertVariant = "info" | "success" | "warning" | "danger";
export type AlertTone = "solid" | "soft" | "outline";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant: AlertVariant;
  tone?: AlertTone;
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissButtonProps?: Omit<ButtonProps, "children" | "variant" | "size" | "aria-label">;
  action?: ReactNode;
  role?: "alert" | "status";
}

const variantStyles: Record<AlertVariant, Record<AlertTone, string>> = {
  info: {
    solid: "bg-blue-600 text-white",
    soft: "bg-blue-50 text-blue-800 border border-blue-200",
    outline: "border border-blue-300 text-blue-800 bg-white",
  },
  success: {
    solid: "bg-green-600 text-white",
    soft: "bg-green-50 text-green-800 border border-green-200",
    outline: "border border-green-300 text-green-800 bg-white",
  },
  warning: {
    solid: "bg-amber-600 text-white",
    soft: "bg-amber-50 text-amber-800 border border-amber-200",
    outline: "border border-amber-300 text-amber-800 bg-white",
  },
  danger: {
    solid: "bg-red-600 text-white",
    soft: "bg-red-50 text-red-800 border border-red-200",
    outline: "border border-red-300 text-red-800 bg-white",
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  danger: (
    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant,
      tone = "soft",
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      dismissButtonProps,
      action,
      role = "alert",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const titleId = title ? `${generatedId}-title` : undefined;
    const descriptionId = description ? `${generatedId}-description` : undefined;

    const alertIcon = icon ?? defaultIcons[variant];

    const classNames = [
      "relative rounded-lg p-4 flex gap-3",
      variantStyles[variant][tone],
      className,
    ].join(" ");

    return (
      <div
        ref={ref}
        role={role}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={classNames}
        {...props}
      >
        <div className="flex-shrink-0" aria-hidden="true">
          {alertIcon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 id={titleId} className="text-sm font-medium">
              {title}
            </h4>
          )}
          <div id={descriptionId} className={title ? "mt-1 text-sm" : "text-sm"}>
            {description ?? children}
          </div>
          {action && (
            <div className="mt-3 flex items-center gap-2">
              {action}
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="flex-shrink-0 opacity-50 hover:opacity-100"
            {...dismissButtonProps}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export interface InlineAlertProps extends Omit<AlertProps, "role"> {
  role?: "alert" | "status";
}

export const InlineAlert = forwardRef<HTMLDivElement, InlineAlertProps>(
  ({ role = "status", ...props }, ref) => {
    return <Alert ref={ref} role={role} {...props} />;
  },
);

InlineAlert.displayName = "InlineAlert";
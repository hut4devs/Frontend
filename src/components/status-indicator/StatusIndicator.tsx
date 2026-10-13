import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export type StatusType =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "processing"
  | "pending";

export type StatusSize = "sm" | "md" | "lg";

export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "aria-label"> {
  status: StatusType;
  label?: string;
  size?: StatusSize;
  showDot?: boolean;
  dotOnly?: boolean;
  className?: string;
  "aria-label"?: string;
}

const statusStyles: Record<StatusType, { bg: string; text: string; dot: string; ring: string }> = {
  default: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400", ring: "ring-gray-400" },
  success: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500", ring: "ring-green-500" },
  warning: { bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500", ring: "ring-amber-500" },
  danger: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500", ring: "ring-red-500" },
  info: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500", ring: "ring-blue-500" },
  processing: { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500", ring: "ring-purple-500" },
  pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-300", ring: "ring-gray-300" },
};

const sizeStyles: Record<StatusSize, { px: string; py: string; text: string; dot: string; gap: string }> = {
  sm: { px: "px-2", py: "py-0.5", text: "text-xs", dot: "h-1.5 w-1.5", gap: "gap-1" },
  md: { px: "px-2.5", py: "py-1", text: "text-sm", dot: "h-2 w-2", gap: "gap-1.5" },
  lg: { px: "px-3", py: "py-1.5", text: "text-base", dot: "h-2.5 w-2.5", gap: "gap-2" },
};

export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ status, label, size = "md", showDot = true, dotOnly = false, className = "", children, ...props }, ref) => {
    const styles = statusStyles[status];
    const sizes = sizeStyles[size];

    const baseClasses = [
      "inline-flex items-center font-medium rounded-full",
      styles.bg,
      styles.text,
      sizes.px,
      sizes.py,
      sizes.text,
      className,
    ].join(" ");

    const dotClasses = [
      "rounded-full animate-pulse",
      sizes.dot,
      styles.dot,
      styles.ring,
      "ring-2 ring-offset-2 ring-offset-white",
    ].join(" ");

    const content = label ?? children;
    const ariaLabel = typeof content === "string" ? content : undefined;

    if (dotOnly) {
      return (
        <span ref={ref} className={dotClasses} aria-label={ariaLabel} role="status" {...props} />
      );
    }

    return (
      <span ref={ref} className={baseClasses} {...props}>
        {showDot && <span className={dotClasses} aria-hidden="true" />}
        {content && !dotOnly && <span>{content}</span>}
      </span>
    );
  },
);

StatusIndicator.displayName = "StatusIndicator";

export interface StatusBadgeProps extends Omit<StatusIndicatorProps, "dotOnly"> {
  variant?: "solid" | "soft" | "outline";
}

const badgeVariantStyles: Record<StatusType, Record<"solid" | "soft" | "outline", string>> = {
  default: {
    solid: "bg-gray-600 text-white",
    soft: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 text-gray-700 bg-white",
  },
  success: {
    solid: "bg-green-600 text-white",
    soft: "bg-green-100 text-green-800",
    outline: "border border-green-300 text-green-800 bg-white",
  },
  warning: {
    solid: "bg-amber-600 text-white",
    soft: "bg-amber-100 text-amber-800",
    outline: "border border-amber-300 text-amber-800 bg-white",
  },
  danger: {
    solid: "bg-red-600 text-white",
    soft: "bg-red-100 text-red-800",
    outline: "border border-red-300 text-red-800 bg-white",
  },
  info: {
    solid: "bg-blue-600 text-white",
    soft: "bg-blue-100 text-blue-800",
    outline: "border border-blue-300 text-blue-800 bg-white",
  },
  processing: {
    solid: "bg-purple-600 text-white",
    soft: "bg-purple-100 text-purple-800",
    outline: "border border-purple-300 text-purple-800 bg-white",
  },
  pending: {
    solid: "bg-gray-500 text-white",
    soft: "bg-gray-100 text-gray-600",
    outline: "border border-gray-300 text-gray-600 bg-white",
  },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, label, size = "md", variant = "soft", showDot = false, className = "", children, ...props }, ref) => {
    const styles = badgeVariantStyles[status][variant];
    const sizes = sizeStyles[size];

    const baseClasses = [
      "inline-flex items-center font-medium rounded-full border",
      styles,
      sizes.px,
      sizes.py,
      sizes.text,
      className,
    ].join(" ");

    const dotClasses = [
      "rounded-full",
      sizes.dot,
      statusStyles[status].dot,
    ].join(" ");

    const content = label ?? children;

    return (
      <span ref={ref} className={baseClasses} {...props}>
        {showDot && <span className={dotClasses} aria-hidden="true" />}
        {content && <span>{content}</span>}
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export interface StatusListItemProps {
  status: StatusType;
  label: string;
  description?: string;
  action?: ReactNode;
  size?: StatusSize;
}

export function StatusListItem({ status, label, description, action, size = "md" }: StatusListItemProps) {
  const styles = statusStyles[status];
  const sizes = sizeStyles[size];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <span className={["rounded-full", sizes.dot, styles.dot, styles.ring, "ring-2 ring-offset-2 ring-offset-white"].join(" ")} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${styles.text} ${sizes.text}`}>{label}</p>
        {description && <p className={`mt-0.5 text-sm ${styles.text.replace("800", "600").replace("700", "500")}`}>{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}
import { forwardRef, type HTMLAttributes, type ReactNode, type ForwardRefExoticComponent, type RefAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  bordered?: boolean;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  divided?: boolean;
}

export interface CardCompoundComponent extends ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> {
  Header: ForwardRefExoticComponent<CardHeaderProps & RefAttributes<HTMLDivElement>>;
  Content: ForwardRefExoticComponent<CardContentProps & RefAttributes<HTMLDivElement>>;
  Footer: ForwardRefExoticComponent<CardFooterProps & RefAttributes<HTMLDivElement>>;
}

const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hoverable = false,
      bordered = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
      default: "bg-white",
      outlined: "bg-white border border-gray-200",
      elevated: "bg-white shadow-lg",
    };

    const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const borderStyles = bordered ? "border border-gray-200" : "";
    const hoverStyles = hoverable ? "hover:shadow-md hover:border-gray-300 transition-shadow transition-colors cursor-pointer" : "";

    const classNames = [
      "rounded-xl",
      variantStyles[variant],
      paddingStyles[padding],
      borderStyles,
      hoverStyles,
      className,
    ].join(" ");

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  },
);

CardComponent.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`flex items-start justify-between mb-4 ${className}`} {...props}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", children, ...props }, ref) => {
    return <div ref={ref} className={className} {...props}>{children}</div>;
  },
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divided = true, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-end gap-3 pt-4 ${divided ? "border-t border-gray-200" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

const Card = CardComponent as CardCompoundComponent;
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card, CardHeader, CardContent, CardFooter };
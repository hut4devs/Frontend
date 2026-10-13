import { Fragment, useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, type ButtonProps } from "../button";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: DialogSize;
  showCloseButton?: boolean;
  closeButtonProps?: Omit<ButtonProps, "children" | "variant" | "size" | "aria-label">;
  footer?: ReactNode;
  preventCloseOnOverlayClick?: boolean;
  preventCloseOnEscape?: boolean;
  initialFocusRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

const sizeStyles: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

function FocusTrap({ children, onEscape, isActive }: { children: ReactNode; onEscape: () => void; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [isActive, onEscape],
  );

  useEffect(() => {
    if (!isActive) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    };
  }, [isActive, handleKeyDown]);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    const focusTarget = container?.querySelector<HTMLElement>('[data-dialog-focus]') || container;
    focusTarget?.focus();
  }, [isActive]);

  return <div ref={containerRef} tabIndex={-1}>{children}</div>;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeButtonProps,
  footer,
  preventCloseOnOverlayClick = false,
  preventCloseOnEscape = false,
  initialFocusRef,
  overlayClassName = "",
  contentClassName = "",
}: DialogProps) {
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (!preventCloseOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [preventCloseOnOverlayClick, onClose],
  );

  const handleClose = useCallback(() => {
    if (!preventCloseOnEscape) {
      onClose();
    }
  }, [preventCloseOnEscape, onClose]);

  if (!isOpen) return null;

  const dialogId = `dialog-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const titleId = `${dialogId}-title`;
  const descriptionId = description ? `${dialogId}-description` : undefined;

  const dialogContent = (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${overlayClassName}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={handleOverlayClick}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeStyles[size]} transform overflow-hidden rounded-xl bg-white shadow-xl transition-all ${contentClassName}`}
        >
          <div className="flex items-start justify-between p-4 border-b border-gray-200">
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
                onClick={onClose}
                {...closeButtonProps}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
          {description && (
            <p id={descriptionId} className="px-4 py-2 text-sm text-gray-500">
              {description}
            </p>
          )}
          <div
            className="p-4"
            data-dialog-focus
            tabIndex={-1}
            ref={initialFocusRef}
          >
            {children}
          </div>
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <Fragment>
      <FocusTrap isActive={isOpen} onEscape={handleClose}>
        {dialogContent}
      </FocusTrap>
    </Fragment>,
    document.body,
  );
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      preventCloseOnEscape
      preventCloseOnOverlayClick
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-600">{message}</p>
    </Dialog>
  );
}
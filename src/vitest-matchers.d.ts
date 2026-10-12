import "@testing-library/jest-dom";
import { Expect, Assertion } from "vitest";

declare module "vitest" {
  interface Assertion<T> {
    toBeInTheDocument(): T;
    toBeDisabled(): T;
    toBeRequired(): T;
    toBeChecked(): T;
    toHaveFocus(): T;
    toHaveAttribute(name: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveTextContent(text: string | RegExp): T;
    toContainHTML(html: string): T;
  }
}
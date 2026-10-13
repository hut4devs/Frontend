import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import "@testing-library/jest-dom";

afterEach(cleanup);

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-blue-600");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-100");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });

  it("applies size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6");
  });

  it("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading state with spinner", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toContainHTML("svg");
  });

  it("calls onClick handler", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    screen.getByRole("button").click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Click me</Button>);
    screen.getByRole("button").click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders left and right icons", () => {
    render(
      <Button leftIcon={<span data-testid="left">←</span>} rightIcon={<span data-testid="right">→</span>}>
        With icons
      </Button>,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>Full width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("has focus visible styles", () => {
    render(<Button>Focusable</Button>);
    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();
  });
});
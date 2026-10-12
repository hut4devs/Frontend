import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert, InlineAlert } from "./Alert";
import { Button } from "../button";

afterEach(cleanup);

describe("Alert", () => {
  it("renders with variant and default soft tone", () => {
    render(<Alert variant="info">Info message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-blue-50");
    expect(alert).toHaveClass("text-blue-800");
    expect(alert).toHaveClass("border-blue-200");
  });

  it("applies solid tone styles", () => {
    render(<Alert variant="success" tone="solid">Success</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-green-600");
    expect(screen.getByRole("alert")).toHaveClass("text-white");
  });

  it("applies outline tone styles", () => {
    render(<Alert variant="warning" tone="outline">Warning</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("border-amber-300");
    expect(screen.getByRole("alert")).toHaveClass("bg-white");
  });

  it("renders title and description", () => {
    render(<Alert variant="danger" title="Error" description="Something went wrong" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders children when no description", () => {
    render(<Alert variant="info">Child content</Alert>);
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("shows default icon for each variant", () => {
    const { rerender } = render(<Alert variant="info">Info</Alert>);
    expect(screen.getByRole("alert")).toContainHTML("svg");

    rerender(<Alert variant="success">Success</Alert>);
    expect(screen.getByRole("alert")).toContainHTML("svg");

    rerender(<Alert variant="warning">Warning</Alert>);
    expect(screen.getByRole("alert")).toContainHTML("svg");

    rerender(<Alert variant="danger">Danger</Alert>);
    expect(screen.getByRole("alert")).toContainHTML("svg");
  });

  it("allows custom icon", () => {
    render(<Alert variant="info" icon={<span data-testid="custom">★</span>}>Custom icon</Alert>);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("renders dismissible button and calls onDismiss", () => {
    const onDismiss = vi.fn();
    render(<Alert variant="info" dismissible onDismiss={onDismiss}>Dismissible</Alert>);
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not show dismiss button when not dismissible", () => {
    render(<Alert variant="info" dismissible={false} onDismiss={vi.fn()}>Not dismissible</Alert>);
    expect(screen.queryByLabelText("Dismiss")).not.toBeInTheDocument();
  });

  it("renders action content", () => {
    render(
      <Alert variant="info" action={<Button size="sm" variant="outline">Action</Button>}>
        With action
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("uses role='status' when specified", () => {
    render(<Alert variant="info" role="status">Status message</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Alert ref={ref} variant="info">Ref test</Alert>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("applies custom className", () => {
    render(<Alert variant="info" className="custom-alert">Custom</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("custom-alert");
  });
});

describe("InlineAlert", () => {
  it("renders with role='status' by default", () => {
    render(<InlineAlert variant="info">Inline alert</InlineAlert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("allows overriding role", () => {
    render(<InlineAlert variant="info" role="alert">Inline alert</InlineAlert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<InlineAlert ref={ref} variant="info">Ref test</InlineAlert>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StatusIndicator, StatusBadge, StatusListItem } from "./StatusIndicator";
import { Button } from "../button";

afterEach(cleanup);

describe("StatusIndicator", () => {
  it("renders with default size and dot", () => {
    render(<StatusIndicator status="success" label="Active" />);
    const indicator = screen.getByText("Active").parentElement!;
    expect(indicator).toHaveClass("bg-green-100");
    expect(indicator).toHaveClass("text-green-800");
    expect(indicator).toContainHTML("span"); // dot
  });

  it("applies different status styles", () => {
    const { rerender } = render(<StatusIndicator status="default" label="Default" />);
    expect(screen.getByText("Default").parentElement).toHaveClass("bg-gray-100");

    rerender(<StatusIndicator status="success" label="Success" />);
    expect(screen.getByText("Success").parentElement).toHaveClass("bg-green-100");

    rerender(<StatusIndicator status="warning" label="Warning" />);
    expect(screen.getByText("Warning").parentElement).toHaveClass("bg-amber-100");

    rerender(<StatusIndicator status="danger" label="Danger" />);
    expect(screen.getByText("Danger").parentElement).toHaveClass("bg-red-100");

    rerender(<StatusIndicator status="info" label="Info" />);
    expect(screen.getByText("Info").parentElement).toHaveClass("bg-blue-100");

    rerender(<StatusIndicator status="processing" label="Processing" />);
    expect(screen.getByText("Processing").parentElement).toHaveClass("bg-purple-100");

    rerender(<StatusIndicator status="pending" label="Pending" />);
    expect(screen.getByText("Pending").parentElement).toHaveClass("bg-gray-100");
  });

  it("applies size classes", () => {
    const { rerender } = render(<StatusIndicator status="success" label="Small" size="sm" />);
    expect(screen.getByText("Small").parentElement).toHaveClass("px-2");
    expect(screen.getByText("Small").parentElement).toHaveClass("text-xs");

    rerender(<StatusIndicator status="success" label="Medium" size="md" />);
    expect(screen.getByText("Medium").parentElement).toHaveClass("px-2.5");
    expect(screen.getByText("Medium").parentElement).toHaveClass("text-sm");

    rerender(<StatusIndicator status="success" label="Large" size="lg" />);
    expect(screen.getByText("Large").parentElement).toHaveClass("px-3");
    expect(screen.getByText("Large").parentElement).toHaveClass("text-base");
  });

  it("hides dot when showDot={false}", () => {
    render(<StatusIndicator status="success" label="No dot" showDot={false} />);
    const indicator = screen.getByText("No dot").parentElement!;
    expect(indicator).not.toContainHTML("animate-pulse");
  });

  it("renders dotOnly mode", () => {
    render(<StatusIndicator status="success" label="Only dot" dotOnly />);
    const dot = screen.getByRole("status", { name: "Only dot" });
    expect(dot).toHaveClass("h-2");
    expect(dot).toHaveClass("w-2");
    expect(dot).toHaveClass("bg-green-500");
    expect(dot).not.toContainHTML("Active");
  });

  it("renders children when no label", () => {
    render(<StatusIndicator status="info"><span data-testid="child">Custom</span></StatusIndicator>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<StatusIndicator ref={ref} status="success" label="Ref test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });

  it("applies custom className", () => {
    render(<StatusIndicator status="success" label="Custom" className="custom-class" />);
    expect(screen.getByText("Custom").parentElement).toHaveClass("custom-class");
  });
});

describe("StatusBadge", () => {
  it("renders with default soft variant", () => {
    render(<StatusBadge status="success" label="Active" />);
    const badge = screen.getByText("Active");
    expect(badge.parentElement).toHaveClass("bg-green-100");
    expect(badge.parentElement).toHaveClass("text-green-800");
  });

  it("applies solid variant", () => {
    render(<StatusBadge status="success" label="Active" variant="solid" />);
    expect(screen.getByText("Active").parentElement).toHaveClass("bg-green-600");
    expect(screen.getByText("Active").parentElement).toHaveClass("text-white");
  });

  it("applies outline variant", () => {
    render(<StatusBadge status="success" label="Active" variant="outline" />);
    expect(screen.getByText("Active").parentElement).toHaveClass("border-green-300");
    expect(screen.getByText("Active").parentElement).toHaveClass("bg-white");
  });

  it("shows dot when showDot={true}", () => {
    render(<StatusBadge status="warning" label="Warning" showDot />);
    expect(screen.getByText("Warning").parentElement).toContainHTML("span");
  });

  it("applies size classes", () => {
    const { rerender } = render(<StatusBadge status="info" label="Small" size="sm" />);
    expect(screen.getByText("Small").parentElement).toHaveClass("px-2");
    expect(screen.getByText("Small").parentElement).toHaveClass("text-xs");

    rerender(<StatusBadge status="info" label="Large" size="lg" />);
    expect(screen.getByText("Large").parentElement).toHaveClass("px-3");
    expect(screen.getByText("Large").parentElement).toHaveClass("text-base");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<StatusBadge ref={ref} status="success" label="Ref test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
  });
});

describe("StatusListItem", () => {
  it("renders label and status dot", () => {
    render(<StatusListItem status="success" label="Task complete" />);
    const container = screen.getByText("Task complete").closest(".flex.items-start");
    expect(container).toBeInTheDocument();
    expect(container).toContainHTML("bg-green-500");
  });

  it("renders description", () => {
    render(<StatusListItem status="warning" label="Pending" description="Waiting for approval" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Waiting for approval")).toBeInTheDocument();
  });

  it("renders action", () => {
    render(<StatusListItem status="info" label="Info" action={<Button size="sm">View</Button>} />);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { rerender } = render(<StatusListItem status="success" label="Small" size="sm" />);
    const container = screen.getByText("Small").closest(".flex.items-start");
    expect(container).toContainHTML("h-1.5");

    rerender(<StatusListItem status="success" label="Large" size="lg" />);
    const containerLg = screen.getByText("Large").closest(".flex.items-start");
    expect(containerLg).toContainHTML("h-2.5");
  });

  it("has hover effect", () => {
    render(<StatusListItem status="success" label="Hoverable" />);
    const container = screen.getByText("Hoverable").closest(".flex.items-start");
    expect(container).toHaveClass("hover:bg-gray-50");
  });
});
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Label } from "./Label";
import { Input, Textarea, Select } from "./Input";

afterEach(cleanup);

describe("Label", () => {
  it("renders label text", () => {
    render(<Label htmlFor="test">Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(<Label htmlFor="test" required>Email</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("(required)")).toBeInTheDocument();
  });

  it("applies disabled styles", () => {
    render(<Label htmlFor="test" disabled>Email</Label>);
    expect(screen.getByText("Email")).toHaveClass("opacity-50");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Label ref={ref} htmlFor="test">Email</Label>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLLabelElement));
  });
});

describe("Input", () => {
  it("renders input with label", () => {
    render(<Input id="email" label="Email" type="email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("shows hint text", () => {
    render(<Input id="email" label="Email" hint="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("shows error message and sets aria-invalid", () => {
    render(<Input id="email" label="Email" errorMessage="Invalid email" state="error" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("applies error state styles", () => {
    render(<Input id="email" label="Email" state="error" />);
    expect(screen.getByLabelText("Email")).toHaveClass("border-red-500");
  });

  it("applies success state styles", () => {
    render(<Input id="email" label="Email" state="success" />);
    expect(screen.getByLabelText("Email")).toHaveClass("border-green-500");
  });

  it("handles disabled state", () => {
    render(<Input id="email" label="Email" disabled />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("handles required attribute", () => {
    render(<Input id="email" label="Email" required />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();
    render(<Input id="email" label="Email" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders left and right icons", () => {
    render(
      <Input
        id="search"
        label="Search"
        leftIcon={<span data-testid="left">🔍</span>}
        rightIcon={<span data-testid="right">✕</span>}
      />,
    );
    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toHaveClass("pl-10");
    expect(screen.getByLabelText("Search")).toHaveClass("pr-10");
  });

  it("applies size classes", () => {
    const { rerender } = render(<Input id="test" label="Test" size="sm" />);
    expect(screen.getByLabelText("Test")).toHaveClass("px-3");

    rerender(<Input id="test" label="Test" size="md" />);
    expect(screen.getByLabelText("Test")).toHaveClass("px-4");

    rerender(<Input id="test" label="Test" size="lg" />);
    expect(screen.getByLabelText("Test")).toHaveClass("px-4");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Input ref={ref} id="test" label="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

describe("Textarea", () => {
  it("renders textarea with label", () => {
    render(<Textarea id="message" label="Message" />);
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveAttribute("rows", "3");
  });

  it("applies custom rows", () => {
    render(<Textarea id="message" label="Message" rows={5} />);
    expect(screen.getByLabelText("Message")).toHaveAttribute("rows", "5");
  });

  it("shows error message", () => {
    render(<Textarea id="message" label="Message" errorMessage="Required" state="error" />);
    expect(screen.getByLabelText("Message")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} id="test" label="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });
});

describe("Select", () => {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3", disabled: true },
  ];

  it("renders select with options", () => {
    render(<Select id="select" label="Choose" options={options} />);
    const select = screen.getByLabelText("Choose");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 3" })).toBeDisabled();
  });

  it("shows placeholder option", () => {
    render(<Select id="select" label="Choose" options={options} placeholder="Select..." />);
    expect(screen.getByRole("option", { name: "Select..." })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Select..." })).toBeDisabled();
  });

  it("handles multiple selection", () => {
    render(<Select id="select" label="Choose" options={options} multiple />);
    expect(screen.getByLabelText("Choose")).toHaveAttribute("multiple");
  });

  it("shows error state", () => {
    render(<Select id="select" label="Choose" options={options} errorMessage="Required" state="error" />);
    expect(screen.getByLabelText("Choose")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Select ref={ref} id="test" label="Test" options={[]} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLSelectElement));
  });
});
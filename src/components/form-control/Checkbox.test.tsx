import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox, Radio, RadioGroup } from "./Checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  it("renders checkbox with label", () => {
    render(<Checkbox id="terms" label="I agree to terms" />);
    expect(screen.getByRole("checkbox", { name: "I agree to terms" })).toBeInTheDocument();
  });

  it("handles checked state", () => {
    render(<Checkbox id="terms" label="I agree" defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("shows hint text", () => {
    render(<Checkbox id="terms" label="I agree" hint="Required for signup" />);
    expect(screen.getByText("Required for signup")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Checkbox id="terms" label="I agree" errorMessage="Must accept terms" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Must accept terms")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<Checkbox id="terms" label="I agree" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByText("I agree")).toHaveClass("opacity-50");
  });

  it("handles required attribute", () => {
    render(<Checkbox id="terms" label="I agree" required />);
    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-required", "true");
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();
    render(<Checkbox id="terms" label="I agree" onChange={handleChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref} id="test" label="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

describe("Radio", () => {
  it("renders radio with label", () => {
    render(<Radio id="option1" name="group" value="1" label="Option 1" />);
    expect(screen.getByRole("radio", { name: "Option 1" })).toBeInTheDocument();
  });

  it("handles checked state", () => {
    render(<Radio id="option1" name="group" value="1" label="Option 1" defaultChecked />);
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("handles disabled state", () => {
    render(<Radio id="option1" name="group" value="1" label="Option 1" disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
    expect(screen.getByText("Option 1")).toHaveClass("opacity-50");
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();
    render(<Radio id="option1" name="group" value="1" label="Option 1" onChange={handleChange} />);
    fireEvent.click(screen.getByRole("radio"));
    expect(handleChange).toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Radio ref={ref} id="test" name="group" value="1" label="Test" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

describe("RadioGroup", () => {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3", disabled: true },
  ];

  it("renders radio group with legend", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} />);
    expect(screen.getByRole("group", { name: "Choose one" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option 2" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option 3" })).toBeDisabled();
  });

  it("shows selected value", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} value="2" />);
    expect(screen.getByRole("radio", { name: "Option 2" })).toBeChecked();
  });

  it("calls onChange with selected value", () => {
    const handleChange = vi.fn();
    render(<RadioGroup name="group" label="Choose one" options={options} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Option 1" }));
    expect(handleChange).toHaveBeenCalledWith("1");
  });

  it("shows error message", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} errorMessage="Required" />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} disabled />);
    expect(screen.getByRole("radio", { name: "Option 1" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Option 2" })).toBeDisabled();
    expect(screen.getByText("Choose one")).toHaveClass("opacity-50");
  });

  it("handles horizontal orientation", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} orientation="horizontal" />);
    expect(screen.getByRole("radiogroup")).toHaveClass("flex");
  });

  it("shows required indicator on legend", () => {
    render(<RadioGroup name="group" label="Choose one" options={options} required />);
    expect(screen.getAllByText("*")).toHaveLength(4);
  });
});